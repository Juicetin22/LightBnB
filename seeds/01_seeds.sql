INSERT INTO users (name, email, password) 
VALUES ('Hey You', 'hey@you.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Cat Dog', 'cat@dog.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Raccoon Baboon', 'raccoon@baboon.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Smile Frown', 'smile@frown.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Say Cheese', 'say@cheese.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) 
VALUES (1, 'Noice nice', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 111, 3, 3, 4, 'Canada', '111 Nice Road', 'Hue', 'Ontario', 'MMM MMM', true),
(2, 'BBT Bubbleplease', 'description', 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg', 222, 4, 5, 5, 'Canada', '222 BBT Private', 'Bear', 'Alberta', '123 456', true),
(3, 'Say what', 'description', 'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg', 333, 5, 4, 7, 'Canada', '333 Garb Street', 'Pelican', 'Manitoba', 'NNN OOO', true),
(4, 'Animal lamina', 'description', 'https://images.pexels.com/photos/2076739/pexels-photo-2076739.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2076739/pexels-photo-2076739.jpeg', 444, 6, 5, 7, 'Canada', '444 Soar Circle', 'Eat', 'Saskatchewan', '232 232', true),
(4, 'Kangaroo ooragnak', 'description', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 554, 5, 6, 7, 'Canada', '554 Cake Park', 'Yum', 'Ontario', 'YES PLS', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id) 
VALUES (DATE '2020-12-01', DATE '2020-12-12', 1, 5),
(DATE '2019-09-02', DATE '2019-10-02', 2, 3),
(DATE '2019-07-22', DATE '2019-09-22', 3, 2),
(DATE '2018-06-21', DATE '2018-06-23', 4, 1),
(DATE '2021-11-25', DATE '2021-12-17', 4, 5);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (5, 1, 1, 5, 'messages'),
(3, 4, 3, 3, 'messages'),
(4, 1, 2, 4, 'messages'),
(2, 3, 4, 5, 'messages'),
(1, 5, 5, 1, 'messages');