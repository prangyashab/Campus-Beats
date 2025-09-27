-- Insert sample users
INSERT INTO users (name, email, password, university_domain, points, is_active, created_at, updated_at) VALUES
('Alex', 'alex@stateu.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ik0J/Hi9Cp2lm6ND.ac1.19bci36jO', 'stateu.edu', 2500, true, NOW(), NOW()),
('Brenda', 'brenda@tech.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ik0J/Hi9Cp2lm6ND.ac1.19bci36jO', 'tech.edu', 1800, true, NOW(), NOW()),
('Carlos', 'carlos@stateu.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ik0J/Hi9Cp2lm6ND.ac1.19bci36jO', 'stateu.edu', 3200, true, NOW(), NOW());

-- Insert user badges
INSERT INTO user_badges (user_id, badge) VALUES
(1, 'TOP_DJ'),
(1, 'PLAYLIST_KING'),
(2, 'EARLY_LISTENER'),
(3, 'CAMPUS_LEGEND'),
(3, 'TOP_DJ');

-- Insert sample tracks
INSERT INTO tracks (title, artist, album, cover_art, url, duration, genre, uploader_id, play_count, is_active, created_at, updated_at) VALUES
('Dil Se Re', 'A. R. Rahman', 'Dil Se', 'https://picsum.photos/seed/bollywood1/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 412, 'Bollywood', 1, 150, true, NOW(), NOW()),
('Chaiyya Chaiyya', 'Sukhwinder Singh, Sapna Awasthi', 'Dil Se', 'https://picsum.photos/seed/bollywood2/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 415, 'Bollywood', 1, 200, true, NOW(), NOW()),
('Tujhe Dekha Toh', 'Lata Mangeshkar, Kumar Sanu', 'DDLJ', 'https://picsum.photos/seed/bollywood3/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 302, 'Bollywood', 2, 180, true, NOW(), NOW()),
('Kal Ho Naa Ho', 'Sonu Nigam', 'Kal Ho Naa Ho', 'https://picsum.photos/seed/bollywood4/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 321, 'Bollywood', 2, 220, true, NOW(), NOW()),
('Jai Ho', 'A. R. Rahman, Sukhwinder Singh', 'Slumdog Millionaire', 'https://picsum.photos/seed/bollywood5/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 342, 'Bollywood', 3, 300, true, NOW(), NOW()),
('Campus Loop', 'Student DJ', 'Campus Vibes', 'https://picsum.photos/seed/music1/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 222, 'Lo-fi', 1, 120, true, NOW(), NOW()),
('Library Echoes', 'The Bookworms', 'Study Sessions', 'https://picsum.photos/seed/music2/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 292, 'Ambient', 2, 95, true, NOW(), NOW()),
('Quad Anthem', 'The Grads', 'Campus Life', 'https://picsum.photos/seed/music3/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 233, 'Indie Rock', 3, 160, true, NOW(), NOW()),
('Finals Week Funk', 'Cram Session', 'Stress Relief', 'https://picsum.photos/seed/music4/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 324, 'Funk', 1, 140, true, NOW(), NOW()),
('Lecture Hall Haze', 'Prof. Groove', 'Academic Beats', 'https://picsum.photos/seed/music5/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 278, 'Chillwave', 2, 110, true, NOW(), NOW()),
('Dorm Room Dreams', 'Late Nighters', 'Midnight Sessions', 'https://picsum.photos/seed/music6/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 198, 'Bedroom Pop', 3, 85, true, NOW(), NOW()),
('Spring Break Beats', 'DJ Sunny', 'Party Time', 'https://picsum.photos/seed/music7/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 250, 'EDM', 1, 190, true, NOW(), NOW()),
('After Class', 'The Slackers', 'Chill Out', 'https://picsum.photos/seed/music8/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 215, 'Acoustic', 2, 75, true, NOW(), NOW()),
('Midnight Study', 'Focus Flow', 'Deep Work', 'https://picsum.photos/seed/music9/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 180, 'Lo-fi', 1, 65, true, NOW(), NOW()),
('Workout Warrior', 'Gym Beast', 'Pump It Up', 'https://picsum.photos/seed/music10/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', 195, 'Electronic', 3, 145, true, NOW(), NOW()),
('Party All Night', 'DJ Campus', 'Weekend Vibes', 'https://picsum.photos/seed/music11/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', 240, 'Dance', 2, 210, true, NOW(), NOW()),
('Zen Garden', 'Peaceful Mind', 'Meditation', 'https://picsum.photos/seed/music12/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3', 300, 'Ambient', 1, 55, true, NOW(), NOW()),
('Coffee Shop Jazz', 'Smooth Beans', 'Cafe Sessions', 'https://picsum.photos/seed/music13/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3', 220, 'Jazz', 3, 90, true, NOW(), NOW()),
('Late Night Drive', 'Neon Lights', 'City Nights', 'https://picsum.photos/seed/music14/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3', 265, 'Synthwave', 2, 125, true, NOW(), NOW()),
('Morning Motivation', 'Rise & Shine', 'Daily Grind', 'https://picsum.photos/seed/music15/200', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3', 185, 'Pop', 1, 170, true, NOW(), NOW());

-- Insert sample playlists
INSERT INTO playlists (name, description, cover_art, category, creator_id, is_public, is_active, created_at, updated_at) VALUES
('Study Vibes', 'Lo-fi beats and ambient sounds for focus.', 'https://picsum.photos/seed/playlist1/400', 'STUDY', 1, true, true, NOW(), NOW()),
('Fest Hits', 'Get hyped with these campus festival anthems.', 'https://picsum.photos/seed/playlist2/400', 'FEATURED', 2, true, true, NOW(), NOW()),
('After Exam Chill', 'Relax and unwind after a long week of exams.', 'https://picsum.photos/seed/playlist3/400', 'CHILL', 3, true, true, NOW(), NOW()),
('Bollywood Beats', 'Iconic hits from Hindi cinema.', 'https://picsum.photos/seed/playlist4/400', 'FEATURED', 1, true, true, NOW(), NOW()),
('Gym Power', 'High-energy beats for your workout.', 'https://picsum.photos/seed/playlist5/400', 'WORKOUT', 2, true, true, NOW(), NOW()),
('Meditation Zone', 'Calm your mind with these ambient sounds.', 'https://picsum.photos/seed/playlist6/400', 'CHILL', 3, true, true, NOW(), NOW()),
('Relax & Unwind', 'Chill tracks to help you de-stress.', 'https://picsum.photos/seed/playlist7/400', 'CHILL', 1, true, true, NOW(), NOW()),
('Campus Party', 'The ultimate soundtrack for your next party.', 'https://picsum.photos/seed/playlist8/400', 'PARTY', 2, true, true, NOW(), NOW());

-- Insert playlist tracks
INSERT INTO playlist_tracks (playlist_id, track_id, track_order) VALUES
-- Study Vibes playlist
(1, 11, 0), (1, 6, 1), (1, 1, 2), (1, 2, 3), (1, 14, 4), (1, 18, 5),
-- Fest Hits playlist
(2, 12, 0), (2, 13, 1), (2, 3, 2), (2, 16, 3), (2, 20, 4),
-- After Exam Chill playlist
(3, 11, 0), (3, 1, 1), (3, 4, 2), (3, 13, 3), (3, 19, 4),
-- Bollywood Beats playlist
(4, 1, 0), (4, 2, 1), (4, 3, 2), (4, 4, 3), (4, 5, 4),
-- Gym Power playlist
(5, 3, 0), (5, 13, 1), (5, 12, 2), (5, 15, 3), (5, 16, 4), (5, 20, 5),
-- Meditation Zone playlist
(6, 11, 0), (6, 1, 1), (6, 17, 2), (6, 7, 3),
-- Relax & Unwind playlist
(7, 6, 0), (7, 2, 1), (7, 4, 2), (7, 13, 3), (7, 18, 4),
-- Campus Party playlist
(8, 3, 0), (8, 13, 1), (8, 6, 2), (8, 12, 3), (8, 16, 4), (8, 19, 5);

-- Insert sample listening room
INSERT INTO listening_rooms (name, description, host_id, current_track_id, current_position, is_playing, is_active, max_participants, created_at, updated_at) VALUES
('Study Vibes Live Listening Room', 'Listen together with your classmates.', 1, 6, 0, false, true, 50, NOW(), NOW());

-- Insert room participants
INSERT INTO room_participants (room_id, user_id) VALUES
(1, 1), (1, 2), (1, 3);

-- Insert room queue
INSERT INTO room_queue (room_id, track_id, added_by_id, queue_order, vote_count, created_at) VALUES
(1, 7, 2, 1, 3, NOW()),
(1, 8, 3, 2, 5, NOW()),
(1, 9, 1, 3, 1, NOW());

-- Insert some votes for queue items
INSERT INTO queue_votes (queue_id, user_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1);