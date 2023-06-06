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
	(in id_usuario_user int, in user_name varchar(30), in nome_usuario varchar(200), in foto_usuario varchar(500), in biografia_usuario text, in email_usuario varchar(256), in premium_usuario tinyint,
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
                                foto = foto_usuario,
                                biografia = biografia_usuario,
                                email = email_usuario,
                                premium = premium_usuario
			where id = id_usuario_user;
		
		end $
        
DROP PROCEDURE proc_update_dados_usuario;

SELECT * FROM tbl_generos;

INSERT INTO tbl_generos (nome) values ('Terror')

INSERT INTO tbl_usuario (
                                            user_name,
                                            nome,
                                            data_nascimento,
                                            foto,
                                            biografia,
                                            email,
                                            premium,
                                            senha)
                                            values (
                                                LOWER('teeeste'),
                                                'teste',
                                                '2000-01-01',
                                                'teste',
                                                'teste',
                                                'teste@gmail',
                                                false,
                                                md5('teste')
                                            );
                                            
ALTER TABLE tbl_classificacao_indicativa MODIFY COLUMN descricao varchar(150) NOT NULL;

DESC tbl_classificacao_indicativa;
							
INSERT INTO tbl_classificacao_indicativa (classificacao, descricao)
										values ('Livre', 'Não expõe as crianças a conteúdos potencialmente prejudiciais.'),
											   ('10 anos', 'Conteúdo violento ou linquagem inapropriada para criancas, ainda que em menor intensidade.'),
                                               ('12 anos', 'Podem conter alusão a agressão física, consumo de drogas e insinuação sexual.'),
                                               ('14 anos', 'Conteúdos mais acentuados com violência e ou linguagem sexual.'),
                                               ('16 anos', 'Conteúdos de sexo ou violência mais intensos, com cenas de tortura, suicídio, estupro ou nudez total.'),
                                               ('18 anos', 'Conteúdos violentos e sexuais extremos. Cenas de sexo, incesto ou atos repetidos de tortura, multilação ou abuso sexual.');

SELECT * FROM tbl_classificacao_indicativa;

SELECT * FROM tbl_anuncio;

UPDATE tbl_tipo_publicacao SET tipo = 'História curta' WHERE id = 2;

SELECT * FROM tbl_classificacao_indicativa;

call proc_insert_anuncio ('titulozao', '1', 'https', 1, 1, 'uma marreta', '2021-01-15', "300", "120.00", "ofimesoifmseo", "kofsegmiosfgmo", "danmkfds", 14, 83, 1, '(@id_anuncio_criado, 1), (@id_anuncio_criado, 2)');

DESC tbl_usuario;

        CALL proc_insert_anuncio01 (
                                                '${announcement.titulo}', 
                                                1, 
                                                '${announcement.capa}', 
                                                1, 
                                                0,
                                                '${announcement.sinopse}',
                                                '2023-03-20',
                                                182,
                                                15.00,
                                                '${announcement.pdf}',
                                                '${announcement.epub}',
                                                '${announcement.mobi}',
                                                14,
                                                83,
                                                1
                                                );
        
SELECT * FROM tbl_historia_curta;

call proc_update_historia_curta(2, 'vinizao', 'fmsdoi', 'mfisd', 1, 'uma historia mto engraçada', '2022-01-15', 1, 83, 1, 14, '(2, 1), (2, 2), (2, 3)');

SELECT * FROM tbl_anuncio;

DESC tbl_anuncio;

SHOW TABLES;

ALTER TABLE tbl_anuncio MODIFY COLUMN mobi varchar(500) NOT NULL;

-- Gêneros, tags, qtde obras --

SELECT cast(tbl_usuario.id as DECIMAL) as id_usuario, tbl_usuario.user_name, tbl_usuario.nome, tbl_usuario.data_nascimento, tbl_usuario.foto, tbl_usuario.biografia, tbl_usuario.email, tbl_usuario.premium,
		tbl_tag.id as id_tag, tbl_tag.tag as nome_tag,
        tbl_generos.id as id_genero, tbl_generos.nome as nome_genero,
        tbl_anuncio.id as id_anuncio
        
        FROM tbl_usuario
        
        INNER JOIN tbl_usuario_tag
			ON tbl_usuario.id = tbl_usuario_tag.id_usuario
		INNER JOIN tbl_tag
			ON tbl_tag.id = tbl_usuario_tag.id_tag
            
		INNER JOIN tbl_usuario_genero
			ON tbl_usuario.id = tbl_usuario_genero.id_usuario
		INNER JOIN tbl_generos
			ON tbl_generos.id = tbl_usuario_genero.id_generos
            
		INNER JOIN tbl_anuncio
			ON tbl_usuario.id = tbl_anuncio.id_usuario;

SELECT * FROM tbl_historia_curta;

SELECT cast(tbl_classificacao_indicativa.id AS DECIMAL) as id_classificacao, tbl_classificacao_indicativa.classificacao, tbl_classificacao_indicativa.descricao
   FROM tbl_anuncio

   INNER JOIN tbl_classificacao_indicativa
      ON tbl_classificacao_indicativa.id = tbl_anuncio.id_classificacao

   WHERE tbl_anuncio.id = 44;

SELECT cast(tbl_usuario.id AS DECIMAL) as id_usuario, tbl_usuario.nome as nome_usuario, tbl_usuario.user_name, tbl_usuario.foto
   FROM tbl_anuncio

   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_anuncio.id_usuario

   WHERE tbl_anuncio.id = 44;

SELECT cast(tbl_tipo_publicacao.id AS DECIMAL) as id_tipo_publicacao, tbl_tipo_publicacao.tipo
   FROM tbl_anuncio

   INNER JOIN tbl_tipo_publicacao
      ON tbl_tipo_publicacao.id = tbl_anuncio.id_tipo_publicacao

   WHERE tbl_anuncio.id = 44;

DESC tbl_anuncio;

SELECT * FROM tbl_genero_historia_curta;

UPDATE tbl_anuncio SET status = FALSE WHERE id = 18;

SELECT cast(tbl_generos.id AS DECIMAL) AS id_genero, tbl_generos.nome
   FROM tbl_genero_anuncio

   INNER JOIN tbl_generos
      ON tbl_generos.id = tbl_genero_anuncio.id_genero
   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_genero_anuncio.id_anuncio

   WHERE tbl_genero_anuncio.id_anuncio = 46;

SELECT cast(tbl_generos.id AS DECIMAL) AS id_genero, tbl_generos.nome
   FROM tbl_genero_historia_curta

   INNER JOIN tbl_generos
      ON tbl_generos.id = tbl_genero_historia_curta.id_genero
   INNER JOIN tbl_historia_curta
      ON tbl_historia_curta.id = tbl_genero_historia_curta.id_historia_curta

   WHERE tbl_genero_historia_curta.id_historia_curta = 7;

ALTER TABLE tbl_anuncio MODIFY COLUMN sinopse varchar(2000) NOT NULL;

          delimiter $
        create procedure proc_insert_anuncio
			(in titulo_anuncio varchar(50), in volume_anuncio int, in capa_anuncio varchar(500), in status_anuncio tinyint, in premium_anuncio tinyint, in sinopse_anuncio text, in data_anuncio_anuncio date,
			in quantidade_paginas_anuncio int, in preco_anuncio double, in pdf_anuncio varchar(500),  in epub_anuncio varchar(500), in mobi_anuncio varchar(500), in id_classificacao_anuncio int, in id_usuario_anuncio int, in id_tipo_publicacao_anuncio int,
             in genero_script varchar(200))
            begin
            
            
            START TRANSACTION;
            
            insert into tbl_anuncio(titulo, volume, capa, status, premium, sinopse, data, quantidade_paginas, preco, pdf, id_classificacao, id_usuario, id_tipo_publicacao, epub, mobi)
				values(titulo_anuncio, volume_anuncio, capa_anuncio, status_anuncio, premium_anuncio, sinopse_anuncio, data_anuncio_anuncio, quantidade_paginas_anuncio, preco_anuncio, pdf_anuncio, id_classificacao_anuncio,
                id_usuario_anuncio, id_tipo_publicacao_anuncio, epub_anuncio, mobi_anuncio);
                
            
            SET @id_anuncio_criado = LAST_INSERT_ID();
                
                
			set @insert_tbl_genero_anuncio := 'insert into tbl_genero_anuncio(id_anuncio, id_genero) values';
			set @insert_tbl_genero_anuncio := concat(@insert_tbl_genero_anuncio, genero_script);
            
                
			PREPARE myquery FROM @insert_tbl_genero_anuncio;
			EXECUTE myquery;
            
            COMMIT;
        end $
        
delimiter $ 

DROP PROCEDURE proc_insert_anuncio;

SELECT * FROM tbl_genero_anuncio;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
   FROM tbl_genero_anuncio

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_genero_anuncio.id_anuncio
   INNER JOIN tbl_generos
      ON tbl_generos.id = tbl_genero_anuncio.id_genero
   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_anuncio.id_usuario

   WHERE tbl_genero_anuncio.id_genero in(1, 4, 3);

DESC tbl_anuncio;

 delimiter $
        create procedure proc_update_anuncio
			(in anuncio_id int,in titulo_anuncio varchar(50), in volume_anuncio int, in capa_anuncio varchar(500), in sinopse_anuncio varchar(2000), in data_anuncio_anuncio date,
			in quantidade_paginas_anuncio int, in preco_anuncio double, in pdf_anuncio varchar(500),  in epub_anuncio varchar(500), in mobi_anuncio varchar(500), in id_classificacao_anuncio int, in id_usuario_anuncio int, in id_tipo_publicacao_anuncio int,
            in generos_script varchar(200))
            begin
            START TRANSACTION;
            update tbl_anuncio set
									titulo = titulo_anuncio,
                                    volume = volume_anuncio,
                                    capa = capa_anuncio,
                                    sinopse = sinopse_anuncio,
                                    data = data_anuncio_anuncio,
                                    quantidade_paginas = quantidade_paginas_anuncio,
                                    preco = preco_anuncio,
                                    pdf = pdf_anuncio,
                                    id_classificacao = id_classificacao_anuncio,
                                    id_usuario = id_usuario_anuncio,
                                    id_tipo_publicacao = id_tipo_publicacao_anuncio,
                                    epub = epub_anuncio,
                                    mobi = mobi_anuncio
							where id = anuncio_id;
                            
		DELETE FROM tbl_genero_anuncio where id_anuncio = anuncio_id;
		set @insert_inject := 'insert into tbl_genero_anuncio(id_anuncio, id_genero) values ';
        set @insert_inject := concat(@comando, generos_script);            
            COMMIT;
        end $
        
        DROP PROCEDURE proc_update_anuncio;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
        FROM tbl_genero_anuncio
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_genero_anuncio.id_anuncio
        INNER JOIN tbl_generos
           ON tbl_generos.id = tbl_genero_anuncio.id_genero
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_anuncio.id_usuario
     
        WHERE LOCATE('romance', tbl_generos.nome)
        ORDER BY tbl_anuncio.id DESC;

SELECT id_anuncio, cast(COUNT(id) AS DECIMAL) as quantidade_curtidas FROM tbl_anuncio_curtida WHERE id_anuncio = 58;

SELECT * FROM tbl_favorito_historia_curta;

SELECT * FROM tbl_genero_anuncio;

SELECT cast(tbl_generos.id AS DECIMAL) AS id_genero, tbl_generos.nome
        FROM tbl_genero_anuncio
     
        INNER JOIN tbl_generosxwxw
           ON tbl_generos.id = tbl_genero_anuncio.id_genero
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_genero_anuncio.id_anuncio
     
        WHERE tbl_genero_anuncio.id_anuncio = 51;
        
CALL proc_update_anuncio (
            58,
            'As aventuras de Neymar Júnior', 
            1, 
            'https://i.pinimg.com/736x/18/6f/73/186f73bbfb0d406a869bdfa9d8002ba7.jpg', 
            'Certo dia, Nadine Santos deu a luz a um menino chamado Neymar Júnior, o resto é história...',
            '2023-04-06',
            435,
            25.6,
            'neymar_junior.pdf',
            'neymar_junior.epub',
            'neymar_junior.mobi',
            14,
            83,
            1,
            '(58, 1)'
        );
        
SELECT * FROM tbl_genero_anuncio;

DESC tbl_genero_anuncio;

INSERT INTO tbl_quantidade_lidos_historia_curta (id_historia_curta, id_usuario, id)
                                                    values (
                                                        13,
                                                        83,
                                                        1
                                                    );

ALTER TABLE tbl_quantidade_lidos_historia_curta MODIFY COLUMN id INT NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE;

SELECT * FROM tbl_quantidade_lidos_anuncio;

INSERT INTO tbl_tipo_denuncia (tipo) values ('Conteúdo inapropriado'),
                                            ('Violação dos direitos autorais (plágio)');   

INSERT INTO tbl_genero_anuncio (id_anuncio, id_genero) values (57, 1);

SELECT * FROM tbl_tipo_denuncia_denuncia_anuncio;

SELECT * FROM tbl_anuncio_curtida WHERE id_anuncio = 59 AND id_usuario = 108;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
   FROM tbl_anuncio_favorito

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_anuncio_favorito.id_anuncio
   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_anuncio_favorito.id_usuario

   WHERE tbl_anuncio_favorito.id_usuario = 88;

SELECT cast(COUNT(id) AS DECIMAL) as quantidade_favoritos
   FROM tbl_anuncio_favorito

   WHERE tbl_anuncio_favorito.id_usuario = 88;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
        FROM tbl_quantidade_lidos_anuncio
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_quantidade_lidos_anuncio.id_anuncio
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_quantidade_lidos_anuncio.id_usuario
     
        WHERE tbl_quantidade_lidos_anuncio.id_usuario = 88;

SELECT cast(COUNT(id) AS DECIMAL) as quantidade_favoritos
   FROM tbl_quantidade_lidos_anuncio

   WHERE id_usuario = 88;

SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium
        FROM tbl_favorito_historia_curta
     
        INNER JOIN tbl_historia_curta
           ON tbl_historia_curta.id = tbl_favorito_historia_curta.id_historia_curta
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_favorito_historia_curta.id_usuario
     
        WHERE tbl_favorito_historia_curta.id_usuario = 88;

SELECT tbl_anuncio.titulo, tbl_anuncio.capa, tbl_anuncio.preco
   FROM tbl_carrinho

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_carrinho.id_anuncio
   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_carrinho.id_usuario
   
   WHERE tbl_carrinho.id_anuncio = 51 AND tbl_carrinho.id_usuario = 110;

SELECT * FROM tbl_compra;
SELECT * FROM tbl_carrinho;
SELECT * FROM tbl_carrinho WHERE id_usuario = 88;
UPDATE tbl_carrinho SET status = false WHERE id = 42;
DELETE FROM tbl_compra WHERE id = 16;
SELECT * FROM tbl_livros_comprados;
DELETE FROM tbl_livros_comprados WHERE id = 5;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
        FROM tbl_genero_anuncio
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_genero_anuncio.id_anuncio
        INNER JOIN tbl_generos
           ON tbl_generos.id = tbl_genero_anuncio.id_genero
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_anuncio.id_usuario
     
        WHERE tbl_generos.nome in('Terror', 'Romance') AND tbl_anuncio.status = true
        ORDER BY tbl_anuncio.id DESC;

SELECT cast(id AS DECIMAL) as id, titulo, volume, capa, status, premium, sinopse, data, quantidade_paginas, preco, pdf, epub, mobi 
   FROM tbl_anuncio 
   WHERE preco BETWEEN 0 AND 20
   ORDER BY id DESC;
DESC tbl_carrinho;

SELECT cast(tbl_anuncio.id AS DECIMAL) AS id_anuncio, tbl_anuncio.titulo, tbl_anuncio.capa, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi,
        cast(tbl_carrinho.id AS DECIMAL) AS id_carrinho
        FROM tbl_carrinho
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_carrinho.id_anuncio
        
        WHERE tbl_carrinho.id_usuario = 88 AND tbl_carrinho.status = false;

SELECT cast(id AS DECIMAL) AS id FROM tbl_carrinho ORDER BY id DESC LIMIT 1;

SELECT cast(id AS DECIMAL) AS id FROM tbl_carrinho WHERE id_usuario = 88 AND status = FALSE ORDER BY id DESC LIMIT 1;
SELECT * FROM tbl_compra WHERE id_carrinho = 9;

SELECT cast(tbl_anuncio.id AS DECIMAL) AS id_anuncio, tbl_anuncio.titulo, tbl_anuncio.capa, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
   FROM tbl_compra

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_compra.id_anuncio
   WHERE tbl_compra.id_carrinho = 9;

DESC tbl_livros_comprados;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
   FROM tbl_livros_comprados

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio
   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_livros_comprados.id_usuario

   WHERE tbl_livros_comprados.id_usuario = 88;

   DESC tbl_tag;

SELECT cast(tbl_usuario.id AS decimal) AS id, tbl_usuario.user_name, tbl_usuario.nome, tbl_usuario.data_nascimento, tbl_usuario.foto, tbl_usuario.biografia, tbl_usuario.email, tbl_usuario.premium
   FROM tbl_usuario_tag

   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_usuario_tag.id_usuario
   INNER JOIN tbl_tag
      ON tbl_tag.id = tbl_usuario_tag.id_tag

   WHERE (tbl_usuario.user_name = 'Teste Front' OR tbl_usuario.nome = 'Teste Front') AND tbl_tag.tag = 'Autor';

SELECT FORMAT(SUM(tbl_anuncio.preco), 2) AS total
        FROM tbl_compra

        INNER JOIN tbl_anuncio
            ON tbl_anuncio.id = tbl_compra.id_anuncio

        WHERE tbl_compra.id_carrinho = 24;
SELECT tbl_usuario.foto, tbl_usuario.nome, tbl_usuario.user_name
   FROM tbl_seguidor_seguidores

   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_seguidor_seguidores.id_segue

   WHERE id_seguidor = 83;

-- O script acima traz os seguidores de tal usuário

SELECT tbl_usuario.foto, tbl_usuario.nome, tbl_usuario.user_name
   FROM tbl_seguidor_seguidores

   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_seguidor_seguidores.id_seguidor

   WHERE id_segue = 88;

-- O script acima traz os usuários que tal usuário está seguindo

SELECT * FROM tbl_comentario_anuncio;
SELECT * FROM tbl_comentario_curtida;
DELETE FROM tbl_comentario_curtida;
DELETE FROM tbl_comentario_historia_curta;
UPDATE tbl_historia_curta SET avaliacao = 0;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao
   FROM tbl_seguidor_seguidores
     
   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_seguidor_seguidores.id_seguidor
   INNER JOIN tbl_anuncio
      ON tbl_usuario.id = tbl_anuncio.id_usuario
     
      WHERE tbl_seguidor_seguidores.id_segue = 88 AND tbl_anuncio.status = true;
SELECT tbl_usuario.id, tbl_usuario.foto, tbl_usuario.nome, tbl_usuario.user_name
   FROM tbl_seguidor_seguidores
     
   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_seguidor_seguidores.id_seguidor
     
      WHERE tbl_seguidor_seguidores.id_segue = 88;

DESC tbl_anuncio;
DELETE FROM tbl_anuncio WHERE id = 51;
DESC tbl_carrinho;
SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium, tbl_historia_curta.avaliacao
        FROM tbl_seguidor_seguidores
          
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_seguidor_seguidores.id_seguidor
        INNER JOIN tbl_historia_curta
           ON tbl_usuario.id = tbl_historia_curta.id_usuario
          
           WHERE tbl_seguidor_seguidores.id_segue = 88 AND tbl_historia_curta.status = true;
SELECT cast(id AS DECIMAL) AS id FROM tbl_seguidor_seguidores WHERE id_segue = 88 AND id_seguidor = 83; 
SELECT cast(id AS DECIMAL) AS id FROM tbl_seguidor_seguidores WHERE id_seguidor = 88 AND id_segue = 83;
SELECT SUM(cast(count(tbl_historia_curta.id) AS DECIMAL) + cast(count(tbl_anuncio.id) AS DECIMAL))
   FROM tbl_usuario

   INNER JOIN tbl_historia_curta
      ON tbl_usuario.id = tbl_historia_curta.id_usuario
   INNER JOIN tbl_anuncio
      on tbl_usuario.id = tbl_anuncio.id_usuario;

SELECT cast(COUNT(id) AS DECIMAL) AS total_obras
   FROM (
      SELECT id FROM tbl_historia_curta WHERE id_usuario = 83
      UNION ALL
      SELECT id FROM tbl_anuncio WHERE id_usuario = 83
   ) AS tbl_total_obras;

SELECT id FROM tbl_historia_curta WHERE id_usuario = 83;
SELECT id FROM tbl_anuncio WHERE id_usuario = 83;
SELECT * FROM tbl_recomendacao;
SELECT cast(COUNT(id) AS DECIMAL) AS quantidade_curtidas FROM tbl_recomendacao_curtida WHERE id_recomendacao = 5;
SELECT cast(tbl_recomendacao.id AS DECIMAL) AS id, tbl_recomendacao.conteudo, tbl_recomendacao.data_hora, tbl_recomendacao.id_usuario, tbl_recomendacao.id_anuncio, tbl_recomendacao.spoiler 
        FROM tbl_seguidor_seguidores

        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_seguidor_seguidores.id_seguidor
        INNER JOIN tbl_recomendacao
            ON tbl_usuario.id = tbl_recomendacao.id_usuario

        WHERE tbl_seguidor_seguidores.id_segue = 110;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao, cast(COUNT(tbl_quantidade_lidos_anuncio.id) AS DECIMAL) AS quantidade_lidos
   FROM tbl_quantidade_lidos_anuncio

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_quantidade_lidos_anuncio.id_anuncio
   ORDER BY quantidade_lidos;
   SELECT * FROM tbl_carrinho WHERE id_pagamento_stripe = 'cs_test_b1JazkyMh80sOXRNdNlOYpcKXlfYHMIotH0M5XZnTuTc32kGi7tVKuXeO9';
   DESC tbl_carrinho;
   DESC tbl_compra;
   SELECT * FROM tbl_recomendacao;

SELECT tbl_usuario.nome, tbl_usuario.foto
   FROM tbl_recomendacao

   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_recomendacao.id_usuario

   WHERE tbl_recomendacao.id = 7;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao, cast(count(tbl_livros_comprados.id) AS DECIMAL) AS quantidade_vendas
   FROM tbl_livros_comprados

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio

   GROUP BY tbl_anuncio.id
   ORDER BY quantidade_vendas DESC;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao, cast(count(tbl_anuncio_curtida.id) AS DECIMAL) as quantidade_curtidas
   FROM tbl_anuncio_curtida

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_anuncio_curtida.id_anuncio

   GROUP BY tbl_anuncio.id
   ORDER BY quantidade_curtidas DESC;

SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao, cast(count(tbl_anuncio_curtida.id) AS DECIMAL) as quantidade_curtidas, cast(count(tbl_anuncio_favorito.id) AS DECIMAL) as quantidade_favoritos, cast(count(tbl_quantidade_lidos_anuncio.id) AS DECIMAL) as quantidade_lidos
   FROM tbl_anuncio_curtida

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_anuncio_curtida.id_anuncio
   INNER JOIN tbl_anuncio_favorito
      ON tbl_anuncio.id = tbl_anuncio_favorito.id_anuncio
   INNER JOIN tbl_quantidade_lidos_anuncio
      ON tbl_anuncio.id = tbl_quantidade_lidos_anuncio.id_anuncio

   WHERE tbl_anuncio.id = 66
   GROUP BY tbl_anuncio.id
   ORDER BY tbl_anuncio.id DESC;
SELECT * FROM tbl_carrinho;
DESC tbl_carrinho;
DESC tbl_compra;
DESC tbl_livros_comprados;
SELECT SUM(tbl_anuncio.preco) AS receita_gerada
   FROM tbl_livros_comprados

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio

   WHERE tbl_livros_comprados.id_anuncio = 1;

SELECT * FROM tbl_anuncio;
SELECT * FROM tbl_livros_comprados;
SELECT * FROM tbl_generos;
SELECT 
   (CAST(COUNT(CASE WHEN tbl_usuario_tag.id_tag = 1 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_somente_escritor,
   (CAST(COUNT(CASE WHEN tbl_usuario_tag.id_tag = 2 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_somente_leitor
   FROM tbl_usuario_tag

   INNER JOIN tbl_tag
      ON tbl_tag.id = tbl_usuario_tag.id_tag
   INNER JOIN tbl_usuario
      ON tbl_usuario.id = tbl_usuario_tag.id_usuario
   INNER JOIN tbl_livros_comprados
      ON tbl_usuario.id = tbl_livros_comprados.id_usuario
      
   WHERE tbl_livros_comprados.id_anuncio = 1;

SELECT * FROM tbl_livros_comprados WHERE id_usuario = 3 OR id_usuario = 4;
SELECT * FROM tbl_usuario_tag WHERE id_usuario = 3 OR id_usuario = 4;
SELECT * FROM tbl_anuncio;
SELECT
   CAST(COUNT(tbl_comentario_anuncio.id) AS DECIMAL) AS total_avaliacoes,
   (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 1 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_um,
   (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 2 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_dois,
   (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 3 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_tres,
   (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 4 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_quatro,
   (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 5 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_cinco
   FROM tbl_comentario_anuncio
   
   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_comentario_anuncio.id_anuncio
   
   WHERE tbl_comentario_anuncio.id_anuncio = 1
   GROUP BY tbl_anuncio.id;
DESC tbl_comentario_anuncio;
SELECT * FROM tbl_comentario_anuncio;
SELECT CAST(tbl_comentario_anuncio.id AS DECIMAL) AS id, tbl_comentario_anuncio.titulo, tbl_comentario_anuncio.resenha, tbl_comentario_anuncio.avaliacao
   FROM tbl_comentario_anuncio

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_comentario_anuncio.id_anuncio

   WHERE tbl_comentario_anuncio.id_anuncio = 1;

-- TRUNCATE tbl_compra;
-- SET foreign_key_checks = 1;

SELECT * FROM tbl_livros_comprados;
SELECT CAST(COUNT(*) AS DECIMAL) AS quantidade_vendas, tbl_livros_comprados.data_compra, SUM(tbl_anuncio.preco) AS faturamento
   FROM tbl_livros_comprados

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio

   WHERE tbl_livros_comprados.id_anuncio = 2 AND tbl_livros_comprados.data_compra >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
   GROUP BY tbl_livros_comprados.data_compra
   ORDER BY quantidade_vendas DESC;

SELECT tbl_livros_comprados.data_compra
   FROM tbl_livros_comprados

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio

   WHERE tbl_livros_comprados.id_anuncio = 2 AND tbl_livros_comprados.data_compra >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
   GROUP BY tbl_livros_comprados.data_compra;
   
SELECT CAST(COUNT(*) AS DECIMAL) AS quantidade_vendas
   FROM tbl_livros_comprados

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio

   WHERE tbl_livros_comprados.id_anuncio = 2 AND tbl_livros_comprados.data_compra >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
   GROUP BY tbl_livros_comprados.data_compra;

SELECT SUM(tbl_anuncio.preco) AS faturamento
   FROM tbl_livros_comprados

   INNER JOIN tbl_anuncio
      ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio

   WHERE tbl_livros_comprados.id_anuncio = 2 AND tbl_livros_comprados.data_compra >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
   GROUP BY tbl_livros_comprados.data_compra;

SELECT CAST(COUNT(*) AS DECIMAL) AS maior_valor
   FROM tbl_livros_comprados

   WHERE tbl_livros_comprados.id_anuncio = 2 AND tbl_livros_comprados.data_compra >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
   GROUP BY tbl_livros_comprados.data_compra
   ORDER BY maior_valor DESC LIMIT 1;

SELECT * FROM tbl_livros_comprados;

INSERT INTO tbl_livros_comprados (id_usuario, id_anuncio, data_compra) values (
   2, 2, '2023-06-02'
);