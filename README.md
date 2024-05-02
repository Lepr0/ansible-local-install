# Ansible Local Install

## About

WIP: waiting for ubuntu 24.04 LTS

Automating the installation and configuration of software on a laptop.
All vars packages [located here](playbooks/includes)

## Getting Started

Install `git` and `ansible` first using `apt` (for Debian/Ubuntu-based systems):

```
#!/usr/bin/env bash
sudo apt -y install git ansible-core && \
ansible-galaxy collection install community.general
```
Then clone this repository and set up the environment:
```
#!/usr/bin/env bash
git clone https://github.com/Lepr0/ansible-local-install.git
cd ansible-local-install
git submodule init
git submodule update
ansible-playbook -i hosts.yml playbooks/playbook.yml --diff --ask-become-pass
```
You will be prompted for a password for privilege escalation when necessary.

This brief version skips details on licenses, contributions, and acknowledgments, focusing solely on the setup instructions.
