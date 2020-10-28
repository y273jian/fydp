## Setup PostgreSql (Ubuntu)
1. run installation
```
# Create the file repository configuration:
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key:
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update the package lists:
sudo apt-get update

# Install the latest version of PostgreSQL.
# If you want a specific version, use 'postgresql-12' or similar instead of 'postgresql':
sudo apt-get -y install postgresql
```
2. run `PostgreSQL` service
```
sudo service postgresql start
```
3. connect to `PostgreSQL`, default `<rolename>`: postgres
```
sudo -i -u <rolename>
```
4. access the `PostgreSQL`
```
psql
```
## Create a role
1. Create a role:
```
CREATE ROLE <rolename>
LOGIN 
PASSWORD '<password>';
```
2. Login with the role
```
psql -U <rolename> -W postgres
```
3. Solution for `FATAL: Peer authentication failed for user "postgres"`

    - go to folder `/etc/postgresql/13/main`
    ```
    cd /etc/postgresql/13/main
    ```
    - open pg_hba.conf
    ```
    sudo vim pg_hba.conf
    ```
    - change all `peer` to `md5`

    - restart the service by
    ```
    sudo service postgresql restart
    ```