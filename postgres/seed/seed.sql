BEGIN TRANSACTION;
INSERT INTO users (firstname, email, age, pet, entries, joined) 
VALUES ('kelly', 'kelly@company.com', 42, 'dog', 5, '2024-01-28');

INSERT INTO LOGIN (hash, email) 
VALUES ('$2a$10$7j/jWlM6tt2bLm4CAidy0eV43Eeco8ooASrU7XvHvxqFzFr.Nus/K', 'kelly@company.com');
COMMIT;
