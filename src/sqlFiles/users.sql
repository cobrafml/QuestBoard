create table usesAccounts
(
    ID INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(100),
    lv INT(100),
    streek INT(100)
);

CREATE TABLE userData(
    questID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    qest-Descript VARCHAR(200) AS qd,
    questDuration VARCHAR(10),
    xp INT(100),
    coins INT(100),
    staus INT(1)
    accountID INT(100)
);