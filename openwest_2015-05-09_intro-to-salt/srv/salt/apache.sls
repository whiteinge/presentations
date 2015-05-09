{% set lookup_table = {
    'RedHat': {
       'pkg_name': 'httpd',
       'service_name': 'httpd',
    },
    'Debian': {
       'pkg_name': 'apache2',
       'service_name': 'apache2',
    },
} %}
{% set apache = lookup_table[grains.os_family] %}

apache:
  pkg.installed:
    - name: {{ apache.pkg_name }}

apache_service:
  service.running:
    - name: {{ apache.service_name }}
    - enable: True
    - require:
      - pkg: apache
    - watch:
      - file: mod_status_conf

mod_status_conf:
  file.managed:
    - name: /etc/httpd/conf.d/mod_status.conf
    - source: salt://mod_status.conf.tmpl
