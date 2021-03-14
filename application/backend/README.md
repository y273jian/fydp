# SET UP
## Set up environment

### Install [Python](https://www.python.org/downloads/)

### Install pip:
1. download `get-pip.py`
```
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
```
2. run `get-pip.py`
```
python3 get-pip.py
```
3. check if `pip` installed
```
python3 -m pip --version
```
4. install required packages
```
pip3 install -U -r requirements.txt
```
---
## Migration
### Apply migrtions
```
python3 manage.py migrate
```
---
## Start server
### Run server
```
python3 manage.py runserver
```
---
## Create Superuser for Django admin
### Create superuser
```
python3 manage.py createsuperuser
```