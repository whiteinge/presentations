include:
  - apache

myapp:
  git.latest:
    - name: git@github.com/myco/myapp.git
    - target: /var/www/myapp
    - rev: master
    - watch_in:
      - service: apache_service

drain_apache:
  service.dead:
    - name: httpd
    - prereq:
      - git: myapp
