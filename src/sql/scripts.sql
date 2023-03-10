USE db_eulirio;

SHOW TABLES;

-- Traz os dados do usuario junto das respectivas tags e gêneros --
SELECT cast(tbl_usuario.id AS decimal) AS id_usuario, tbl_usuario.user_name, tbl_usuario.nome as nome_usuario, tbl_usuario.data_nascimento, tbl_usuario.foto, tbl_usuario.biografia, tbl_usuario.email, tbl_usuario.premium,
	   tbl_tag.tag as nome_tag,
       tbl_generos.nome as nome_genero
       
       FROM tbl_usuario
       
       INNER JOIN tbl_usuario_tag
		ON tbl_usuario.id = tbl_usuario_tag.id_usuario
        
	   INNER JOIN tbl_tag
		ON tbl_tag.id = tbl_usuario_tag.id_tag
        
	   INNER JOIN tbl_usuario_genero
		ON tbl_usuario.id = tbl_usuario_genero.id_usuario
        
	   INNER JOIN tbl_generos
		ON tbl_generos.id = tbl_usuario_genero.id_generos
        
	   ORDER BY tbl_usuario.id DESC;
	
-- Traz as tags do usuário de acordo com o ID dele
SELECT tbl_tag.tag as nome_tag
       
       FROM tbl_tag
       
       INNER JOIN tbl_usuario_tag
		ON tbl_tag.id = tbl_usuario_tag.id_tag
        
	   INNER JOIN tbl_usuario
		ON tbl_usuario.id = tbl_usuario_tag.id_usuario
        
	   WHERE tbl_usuario.id = 59;
        
-- Traz os gêneros favoritos do usuário de acordo com o ID dele
SELECT tbl_generos.nome as nome_generos,
	   tbl_usuario.user_name
       
       FROM tbl_generos
       
       INNER JOIN tbl_usuario_genero
		ON tbl_generos.id = tbl_usuario_genero.id_generos
        
	   INNER JOIN tbl_usuario
		ON tbl_usuario.id = tbl_usuario_genero.id_usuario;
         
call proc_update_dados_usuario (59, 'user_front', 'enzao', '2000-01-15', NULL, 'everson zoio', 'user_front@gmail.com', 1, NULL, 2, '(59,1), (59, 2), (59, 3)');

call proc_update_dados_usuario (58, 'testeee', 'enzao', '2000-01-15', 'angola007', 'everson zoio', 'angola@gmail.com', 1, 'aleke', 1, 2, '(58,1), (58, 2), (58, 3)');
        
-- call proc_update_dados_usuario (id_usuario, 'user_name', 'nome_usuario', 'data_nascimento', 'foto_usuario', 'biografia_usuario', 'email_usuario', tinyint_premium, 'senha_usuario', id_tag_1, id_tag_2, '(id_usuario,1), (id_usuario, 2), (id_usuario, 3)');

delimiter $
create procedure proc_update_dados_usuario
	(in id_usuario_user int, in user_name varchar(30), in nome_usuario varchar(200), in data_nascimento date, in foto_usuario varchar(500), in biografia_usuario text, in email_usuario varchar(256), in premium_usuario tinyint,
		in id_tag_1 int, in id_tag_2 int, in generos varchar(300))
		begin
            

        
        IF id_tag_1 IS NOT NULL AND id_tag_2 IS NOT NULL THEN
			DELETE FROM tbl_usuario_tag WHERE id_usuario = id_usuario_user;
			INSERT INTO tbl_usuario_tag (id_usuario, id_tag) values	(id_usuario_user, id_tag_1),
																	(id_usuario_user, id_tag_2);
		ELSEIF id_tag_1 IS NOT NULL AND id_tag_2 IS NULL THEN
			DELETE FROM tbl_usuario_tag WHERE id_usuario = id_usuario_user;
            INSERT INTO tbl_usuario_tag (id_usuario, id_tag) values	(id_usuario_user, id_tag_1);
		ELSEIF id_tag_1 IS NULL AND id_tag_2 IS NOT NULL THEN
			DELETE FROM tbl_usuario_tag WHERE id_usuario = id_usuario_user;
            INSERT INTO tbl_usuario_tag (id_usuario, id_tag) values	(id_usuario_user, id_tag_2);
		END IF;
            
            
        DELETE FROM tbl_usuario_genero where id_usuario = id_usuario_user;
		set @comando := 'insert into tbl_usuario_genero (id_usuario, id_generos) values ';
        set @comando := concat(@comando, generos);
		
        PREPARE myquery from @comando;
        EXECUTE myquery;  
        
        update tbl_usuario set 	user_name = user_name,
								nome = nome_usuario,
                                data_nascimento = data_nascimento,
                                foto = foto_usuario,
                                biografia = biografia_usuario,
                                email = email_usuario,
                                premium = premium_usuario
			where id = id_usuario_user;
		
		end $
        
-- DROP PROCEDURE proc_update_dados_usuario; -- 

SELECT * FROM tbl_generos;

INSERT INTO tbl_generos (nome) values ('Terror')
        
        
        
        
        
        
        
        