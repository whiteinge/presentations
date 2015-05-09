run_the_state_system:
  cmd.state.sls:
    - tgt: {{ data.id }}
    - arg:
      - apache
