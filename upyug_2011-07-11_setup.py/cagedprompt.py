"""A python prompt in a cage, for producing prompt sessions."""
# http://nedbatchelder.com/blog/201107/caged_python.html

import code
import cStringIO as StringIO
import sys
import textwrap  

class CagedPrompt(code.InteractiveConsole):
    def __init__(self):
        env = {'__name__': '__main__'}
        code.InteractiveConsole.__init__(self, env)
        self.out = StringIO.StringIO()

    def run(self, input):
        self.inlines = textwrap.dedent(input).splitlines()
        old_stdout = sys.stdout
        sys.stdout = self.out
        self.interact("Python " + sys.version.split("[")[0])
        sys.stdout = old_stdout
        self.output = self.out.getvalue()

    def raw_input(self, prompt):
        try:
            line = self.inlines.pop(0)
        except IndexError:
            raise EOFError
        if line or prompt == sys.ps2:
            self.write("%s%s\n" % (prompt, line))
        else:
            self.write("\n")
        return line

    def write(self, data):
        self.out.write(data)

def prompt_session(input):
    cp = CagedPrompt()
    cp.run(input)
    return cp.output

if __name__ == '__main__':
    TEST_INPUT = """\
        2+2
        import random
        random.random()
        class Foo:
            pass


        f = Foo()
        f
        """

    print prompt_session(TEST_INPUT)
