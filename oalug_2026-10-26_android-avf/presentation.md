<!-- class: center middle inverse -->

# Debian in your pocket
## Android's Linux Terminal, from the inside

by Seth House

@whiteinge<br>
seth@eseth.com

<aside>

Questions:

- When is the presentation? OALUG demo night.
- How long is the presentation? 10 minutes, demos included.
- What is the fall-back plan if the presentation duration changes? Slides
  marked *optional* in their notes can be skipped without breaking the story.
  If the projector or phone fails, drop the demos and keep going on slides.
- Who is the audience? Linux users who want the details; the notes hold the
  details the slides leave out.

Timing: ~7 minutes of slides, ~3 minutes of demos. Demos, in order:
`vulkaninfo --summary`, SuperTuxKart, vkQuake (windowed!). vkmark only if
there's time.

Demo safety: run one launch at a time, windowed only. Fullscreen Vulkan kills
the Terminal app, and the phone is on the same USB-C display path that hung it
earlier today.

</aside>

---

<!-- class: center middle -->

# This is Debian

```
$ vulkaninfo --summary
    deviceName = PowerVR D-Series DXT-48-1536 MC1
    driverID   = DRIVER_ID_IMAGINATION_PROPRIETARY
```

<aside>

Demo: run this live.

That is the Pixel 10's GPU, and Imagination's *proprietary Android driver*,
printed from inside a Debian VM. There is no Linux GPU driver anywhere in this
stack. The rest of the talk is how that line is possible.

</aside>

---

## What it actually is

<x-inc each>

- Android 16's "Linux Terminal" app is a Debian 13 VM.
- Android Virtualization Framework on pKVM.
- crosvm — the same VMM as ChromeOS's Crostini.

</x-inc>

<aside>

Crostini's design, re-landed on Android; that lineage keeps showing up.

It's a real VM: Android common kernel, generic `linux,dummy-virt` board,
cloud-init NoCloud provisioning, PSCI for power off. No `/dev/kvm`, so no
nested VMs; containers work fine.

Fun fact: `systemd-detect-virt` says `none`.

</aside>

---

<!-- class: center middle -->

# How it works

---

## The terminal is a web page

```
WebView + xterm.js
  └─ vsock → socat → ttyd
       └─ setpriv --reuid=droid … /bin/bash -l
```

<aside>

The app is not a terminal emulator talking to a pty. It's a WebView pointed
at ttyd, bridged over vsock because the guest has no IP route to the host.

Consequence: background the app and the WebView reconnects, wiping
xterm.js's scrollback. tmux is the only durable scrollback you have.

</aside>

---

## `chsh` does nothing

<x-inc>

`setpriv` is not a login program.

</x-inc>

<aside>

`chsh` writes `/etc/passwd` correctly, and SSH honors it. But the app launches
`setpriv … /bin/bash -l`, and `setpriv` just execs what it's handed. `login`,
`su`, and `sshd` read the passwd shell field; `setpriv` has no reason to.

Fix: a systemd drop-in that overrides `ExecStart=`, not an edit to the vendor
unit.

</aside>

---

## Switching to zsh broke the GUI

<x-inc each>

- The display hook lives in `/etc/profile.d/`.
- Only `/etc/profile` sources it — and zsh never reads `/etc/profile`.
- It surfaced two reboots later, as a graphics error.

</x-inc>

<aside>

```
fatal: failed to create compositor backend
```

No mention of shells anywhere. My first fix was `loginctl enable-linger`; the
error *changed*, so it looked fixed. A changed error is not a fixed cause.

The hook manufactures a seated logind session from nothing:
`systemd-run -p PAMName=login -p TTYPath=/dev/tty1 sleep 1d`. That's what
weston's DRM backend needs.

Fix: `emulate sh -c 'source /etc/profile'` in `~/.zprofile`.

</aside>

---

<!-- class: center middle -->

# It's not VNC

---

## One PCI ID

```
$ cat /sys/class/drm/card0/device/uevent
PCI_ID=1AF4:1050
```

<x-inc>

virtio-gpu. Graphics API calls are forwarded to the phone's GPU driver.

</x-inc>

<aside>

`0x1AF4` is virtio; `0x1050` is virtio-gpu. Combined with `gfxstream_enabled`
on the kernel command line: Vulkan and GLES calls are marshalled to Android's
driver, and crosvm hands the scanout buffer to an Android Surface. Nothing is
encoded as images.

Red herring for the sharp-eyed: `libneatvnc0` and weston's `vnc-backend.so`
are installed. Just Debian packaging every backend. Nothing is listening.

</aside>

---

## Demo: SuperTuxKart

```
OpenGL renderer: zink Vulkan 1.3(PowerVR D-Series …
    (IMAGINATION_PROPRIETARY))
```

<aside>

Demo: launch it, windowed.

The renderer string narrates the whole stack: GLES 3.2 → zink → Vulkan →
gfxstream → PowerVR, and it's an SDL app on Xwayland. There is no native GL
path at all. Great crowd-pleaser, poor benchmark.

</aside>

---

## One environment variable, 12x

| vkmark, 1080p | score |
|---|---|
| Vendor default | 26 |
| `MESA_VK_WSI_DEBUG` unset | 321 |

<aside>

*Optional — skip if short on time.*

The vendor sets `MESA_VK_WSI_DEBUG`, forcing a software swapchain so every
frame is read back through the CPU. The software renderer scores the same
either way, so only the GPU path pays.

August numbers. The October update changed the setting from `sw,linear` to
`sw`; re-measure before quoting 12x.

</aside>

---

## Demo: vkQuake

Vulkan-native. No zink.

<aside>

Demo: `timedemo demo1`, windowed 1280x720. About 50 fps in August.

Building it on Debian trixie: both errors point the wrong way. meson demands
"a newer Vulkan SDK" for a flag only LunarG's SDK builds have; and `master`
needs newer Vulkan headers, but tag 1.35.0 doesn't. 329 targets, 16 s wall.

</aside>

---

<!-- class: center middle -->

# When it breaks

---

## Fullscreen kills the app

<x-inc each>

- Windowed: fine, every time.
- Fullscreen: the whole Terminal app dies, and the VM with it.

</x-inc>

<x-inc>

Isolation runs one way.

</x-inc>

<aside>

Same binary, same data, one variable. `vkcube` at the same pixel size is fine,
so it's the fullscreen presentation path, not resolution.

The guest can't log its own death: the VM is killed before journald flushes.

Two bisection runs found this after several rounds of theorising had not.

</aside>

---

## Docking hung the whole phone

```
dwc3-google: DP active, deferring role switch for 125 ms
```

<x-inc>

×6,338. The VM was a casualty, not the cause.

</x-inc>

<aside>

Earlier today. Docked desktop mode: the external display glitched and froze,
then the touchscreen died. The kernel stayed alive; only its own power-key
handler could reset the phone, after several long presses.

The guest's log shows Android changing the display at the moment things went
wrong; weston logged "monitor change … not bothering to do anything about
it."

Yes, that's the same path this phone is using to drive the projector.

</aside>

---

## The VM can adb into its phone

```
adb pair    $gateway:<port> <code>
adb connect $gateway:<port>
```

<aside>

*Optional — skip if short on time.*

With Wireless debugging on, the guest reaches its own host through crosvm's
NAT gateway. That's how the hang above was diagnosed: the guest pulled the
phone's bug report and read the previous boot's kernel log from pstore.

The guest can't log its own death, but it can watch the host that kills it.

</aside>

---

## Other surprises

<x-inc each>

- ~80 GiB of free disk is fenced off by a storage balloon.
- You can raise the RAM, but you shouldn't.
- The mouse wheel is never forwarded.
- No hardware video decode.
- The LAN can't reach the VM, but any Android app can.

</x-inc>

<aside>

*Optional — skip if short on time.*

- Disk: the guest agent sizes a balloon from host free space at VM boot. Free
  space on Android, restart, the VM grows.
- RAM: shared with Android. 10 GiB of 16 starved the app displaying the VM.
- Wheel: the device advertises `REL_WHEEL`; zero scroll events ever arrive.
- Video: gfxstream forwards the GPU, not the video-decode block.
- Network: a `socat` relay in Termux exposes guest SSH to the LAN.

</aside>

---

## Verify, don't assume

Every failure was silent.

<x-inc>

Then one Android update invalidated my notes — and my verification script.

</x-inc>

<aside>

`chsh` reported success and did nothing. The display hook stopped with no
error. 80 GiB vanished without a message.

The October update moved the agent's vsock port, renamed the NIC, removed the
backup disk and sshd, and changed how weston launches. The script meant to
catch vendor drift failed loudly on the least important check and quietly
gave wrong answers on two others.

</aside>

---

## Epilogue

This investigation was done with Claude Code, from inside the VM.

<x-inc each>

- It mined the vendor's unstripped guest agent for its RPC surface.
- It was wrong several times, and the notes say so.
- It crashed my session twice by batching GPU launches; now it runs them one
  at a time.
- It drafted this deck from 2,000 lines of field notes.

</x-inc>

<x-inc>

_**Verify, don't assume — including the AI.**_

</x-inc>

<aside>

Wrong turns it made, all kept in the notes: ext4 reserved blocks for the disk
mystery (the arithmetic said no); linger as the GUI fix (the error just moved);
a 10-bit colour buffer as the crash cause (already excluded by a successful
run). Each was caught the same way: measure, change one variable, re-check.

Notes tag every claim as verified, inferred, or open — which is what made
re-checking after the update possible at all.

</aside>
