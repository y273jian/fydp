CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS centralHub (
    ch_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    ip_addr inet,
    PRIMARY KEY (ch_id)
);

CREATE TABLE IF NOT EXISTS cameraInfo (
    camera_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    ch_id uuid,
    serial_number uuid UNIQUE,
    latitude DECIMAL,
    longtitude DECIMAL,
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
    FOREIGN key (ch_id) REFERENCES centralHub
);

CREATE TABLE IF NOT EXISTS userRole (
    role_id SERIAL,
    role_name VARCHAR,
    description text,
    PRIMARY KEY (role_id)
);

CREATE TABLE IF NOT EXISTS userInfo (
    user_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    email VARCHAR,
    password VARCHAR NOT NULL,
    salt VARCHAR NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS roleOfUser (
    role_of_user_id SERIAL,
    user_id uuid,
    role_id INT,
    PRIMARY KEY (role_of_user_id),
    FOREIGN KEY (user_id) REFERENCES userInfo,
    FOREIGN KEY (role_id) REFERENCES userRole
);

CREATE TABLE IF NOT EXISTS ImageInfo (
    image_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    file_path text,
    size INT, -- [Bytes]
    width INT, -- [px]
    height INT, -- [px]
    taken_camera_id uuid,
    taken_time TIMESTAMP,
    PRIMARY KEY (image_id),
    FOREIGN KEY (taken_camera_id) REFERENCES cameraInfo
);

CREATE TABLE IF NOT EXISTS wildlifeTypes (
    type_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    name VARCHAR,
    PRIMARY KEY (type_id)
);

CREATE TABLE IF NOT EXISTS extractedData (
    record_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    type_id uuid,
    amount INT,
    processed_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_viewed BOOLEAN,
    viewed_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (record_id),
    FOREIGN KEY (type_id) REFERENCES wildlifeTypes
);

CREATE TABLE IF NOT EXISTS correctedData (
    corrected_id uuid UNIQUE DEFAULT uuid_generate_v4(),
    amount INT,
    type_id uuid,
    user_id uuid,
    corrected_time TIMESTAMP,
    PRIMARY KEY (corrected_id),
    FOREIGN KEY (type_id) REFERENCES wildlifeTypes,
    FOREIGN KEY (user_id) REFERENCES userInfo
);

CREATE TABLE IF NOT EXISTS recordToCorrect (
    record_to_correct_id SERIAL,
    corrected_id uuid,
    record_id uuid,
    PRIMARY KEY (record_to_correct_id),
    FOREIGN KEY (corrected_id) REFERENCES correctedData,
    FOREIGN KEY (record_id) REFERENCES extractedData
);
