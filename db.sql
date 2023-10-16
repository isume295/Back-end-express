CREATE DATABASE tat;
\c tat

INSERT INTO users (picture, first_name, last_name, email, password, role, department, created_at, updated_at)
VALUES ('https://www.perfocal.com/blog/content/images/size/w960/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg', 'Sumeya', 'Ibrahim', 'johndoe@example.com', 'password123', 'admin', 'admin', NOW());
select * from users;

Create Table users (
    id SERIAL UNIQUE PRIMARY KEY,
    picture VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR UNIQUE,
    password VARCHAR,
    role VARCHAR,
    department VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);