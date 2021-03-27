DELIMITER $$
DROP PROCEDURE IF EXISTS `matcha`.`CALC_RATING` $$
CREATE DEFINER = `root`@`localhost` PROCEDURE `CALC_RATING`
(OUT `visites`  INT, 
 OUT `likes`    INT, 
 OUT `reported` INT, 
 IN `id_user`   INT
) SQL SECURITY INVOKER COMMENT 'Calculate the user''s rating'
    BEGIN
        SELECT COUNT(*)
        INTO likes
        FROM matcha.matches
        WHERE matched = id_user;
        SELECT COUNT(*)
        INTO visites
        FROM matcha.history
        WHERE visited = id_user;
        SELECT reports
        INTO reported
        FROM matcha.users
        WHERE id = id_user;
        END
$$ DELIMITER;

DELIMITER $$
DROP FUNCTION IF EXISTS `matcha`.`GET_RATING` $$
CREATE DEFINER=`root`@`localhost` FUNCTION `GET_RATING`(`id_user` INT)
RETURNS double DETERMINISTIC
BEGIN
CALL `CALC_RATING`(@visit,@like,@reports,id_user);
RETURN(@like / 20+@visit / 100-@reports / 250);
END$$ DELIMITER;

