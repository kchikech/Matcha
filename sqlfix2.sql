DELIMITER $$
DROP FUNCTION IF EXISTS `matcha`.`GET_RATING` $$
CREATE DEFINER=`root`@`localhost` FUNCTION `GET_RATING`(`id_user` INT)
RETURNS double DETERMINISTIC
BEGIN
CALL `CALC_RATING`(@visit,@like,@reports,id_user);
RETURN(@like / 20+@visit / 100-@reports / 250);
END$$ DELIMITER;