-- CREATE DATABASE wms;

-- \c wms

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS central_hub (
    ch_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    ch_serial VARCHAR UNIQUE,
    ip_addr inet,
    PRIMARY KEY (ch_id)
);

CREATE TABLE IF NOT EXISTS camera_info (
    camera_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    ch_id uuid,
    serial_number VARCHAR UNIQUE,
    camera_alias VARCHAR,
    latitude DECIMAL,
    longitude DECIMAL,
    altitude DECIMAL,
    setup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    battery_level INT,
    is_long_range BOOLEAN,
    bandwidth INT,
    bit_rate INT,
    spread_factor INT,
    freq_deviation INT,
    transmit_power INT,
    last_active_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (camera_id),
    FOREIGN key (ch_id) REFERENCES central_hub
);

CREATE TABLE IF NOT EXISTS user_role (
    role_id SERIAL,
    role_name VARCHAR,
    description text,
    PRIMARY KEY (role_id)
);

CREATE TABLE IF NOT EXISTS user_info (
    user_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    email VARCHAR,
    password VARCHAR NOT NULL,
    salt VARCHAR NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    signup_date TIMESTAMP,
    last_login_time TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS role_of_user (
    role_of_user_id SERIAL,
    user_id uuid,
    role_id INT,
    PRIMARY KEY (role_of_user_id),
    FOREIGN KEY (user_id) REFERENCES user_info,
    FOREIGN KEY (role_id) REFERENCES user_role
);

CREATE TABLE IF NOT EXISTS image_info (
    image_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    ori_file_path text,
    ext_file_path text,
    size INT, -- [Bytes]
    width INT, -- [px]
    height INT, -- [px]
    taken_camera_id uuid,
    taken_time TIMESTAMP,
    PRIMARY KEY (image_id),
    FOREIGN KEY (taken_camera_id) REFERENCES camera_info
);

CREATE TABLE IF NOT EXISTS wildlife_types (
    type_id SERIAL,
    name VARCHAR,
    PRIMARY KEY (type_id)
);

CREATE TABLE IF NOT EXISTS extracted_data (
    record_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    type_id INT,
    amount INT,
    image_id uuid,
    processed_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_viewed BOOLEAN,
    viewed_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (record_id),
    FOREIGN KEY (type_id) REFERENCES wildlife_types,
    FOREIGN KEY (image_id) REFERENCES image_info,
);

CREATE TABLE IF NOT EXISTS corrected_data (
    extracted_id uuid, 
    amount INT,
    type_id INT,
    user_id uuid,
    corrected_time TIMESTAMP,
    PRIMARY KEY (extracted_id),
    FOREIGN KEY (extracted_id) REFERENCES extracted_data,
    FOREIGN KEY (type_id) REFERENCES wildlife_types,
    FOREIGN KEY (user_id) REFERENCES user_info
);

-- CREATE TABLE IF NOT EXISTS record_to_correct (
--     record_to_correct_id SERIAL,
--     corrected_id uuid,
--     record_id uuid,
--     PRIMARY KEY (record_to_correct_id),
--     FOREIGN KEY (corrected_id) REFERENCES corrected_data,
--     FOREIGN KEY (record_id) REFERENCES extracted_data
-- );
