/*
    Objetivo:     API responsible for handling short stories data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 20/03/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertShortStorie = async (shortStorie, genresId) => {
    try {
        let sql = `CALL proc_insert_historia_curta (
            '${shortStorie.titulo}',
            '${shortStorie.sinopse}',
            '${shortStorie.capa}',
            ${shortStorie.status},
            '${shortStorie.historia}',
            '${shortStorie.data}',
            ${shortStorie.premium},
            ${shortStorie.id_usuario},
            ${shortStorie.id_tipo_publicacao},
            ${shortStorie.id_classificacao},
            '${genresId}'
        )`

        const result = await prisma.$queryRawUnsafe(sql)

        console.log(result)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const updateShortStorie = async (shortStorie, genresId) => {
    try {
        let sql = `CALL proc_update_historia_curta (
            ${shortStorie.id},
            '${shortStorie.titulo}',
            '${shortStorie.sinopse}',
            '${shortStorie.capa}',
            '${shortStorie.historia}',
            '${shortStorie.data}',
            ${shortStorie.premium},
            ${shortStorie.id_usuario},
            ${shortStorie.id_tipo_publicacao},
            ${shortStorie.id_classificacao},
            '${genresId}'
        )`

        // console.log(sql)

        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteShortStorie = async (shortStorieId) => {
    try {
        let sql = `DELETE FROM tbl_historia_curta WHERE id = ${shortStorieId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAllShortStories = async () => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) as id, titulo, sinopse, capa, status, historia, data, premium, avaliacao FROM tbl_historia_curta ORDER BY id DESC`

        const rsShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsShortStories)
            return rsShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const desactivateShortStorie = async (shortStorieId) => {
    try {
        let sql = `UPDATE tbl_historia_curta SET status = false WHERE id = ${shortStorieId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const activateShortStorie = async (shortStorieId) => {
    try {
        let sql = `UPDATE tbl_historia_curta SET status = true WHERE id = ${shortStorieId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona apenas o usuário vinculado a tal anúncio
const selectUserByShortStorieId = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(tbl_usuario.id AS DECIMAL) as id_usuario, tbl_usuario.nome as nome_usuario, tbl_usuario.user_name, tbl_usuario.foto
        FROM tbl_historia_curta
     
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_historia_curta.id_usuario
     
        WHERE tbl_historia_curta.id = ${shortStorieId}`

        const rsUser = await prisma.$queryRawUnsafe(sql)

        if(rsUser.length > 0)
            return rsUser
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectPublicationTypeByShortStorieId = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(tbl_tipo_publicacao.id AS DECIMAL) as id_tipo_publicacao, tbl_tipo_publicacao.tipo
        FROM tbl_historia_curta
     
        INNER JOIN tbl_tipo_publicacao
           ON tbl_tipo_publicacao.id = tbl_historia_curta.id_tipo_publicacao
     
        WHERE tbl_historia_curta.id = ${shortStorieId}`

        const rsPublicationType = await prisma.$queryRawUnsafe(sql)

        if(rsPublicationType.length > 0)
            return rsPublicationType
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStorieById = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) as id, titulo, sinopse, capa, status, historia, data, premium, avaliacao FROM tbl_historia_curta WHERE id = ${shortStorieId}`

        const rsShortStorie = await prisma.$queryRawUnsafe(sql)

        if(rsShortStorie.length > 0)
            return rsShortStorie
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona todas as histórias curtas referidas a um certo usuário
const selectShortStorieByUserId = async (shortStorieId) => {
    try {
        let sql = `SELECT tbl_historia_curta.id, tbl_historia_curta.titulo
        
        FROM tbl_historia_curta
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_historia_curta.id_usuario
         
        WHERE tbl_historia_curta.id_usuario = ${shortStorieId}`

        const rsShortStorie = await prisma.$queryRawUnsafe(sql)

        if(rsShortStorie.length > 0)
            return rsShortStorie
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona todas as histórias curtas ativas referidas a um certo usuário
const selectShortStoriesActiveByUserId = async (shortStorieId) => {
    try {
        let sql = `SELECT tbl_historia_curta.id, tbl_historia_curta.titulo
        
        FROM tbl_historia_curta
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_historia_curta.id_usuario
         
        WHERE tbl_historia_curta.id_usuario = ${shortStorieId} AND tbl_historia_curta.status = true`

        const rsShortStorie = await prisma.$queryRawUnsafe(sql)

        if(rsShortStorie.length > 0)
            return rsShortStorie
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona todas as histórias curtas desativadas referidas a um certo usuário
const selectShortStoriesDeactiveByUserId = async (shortStorieId) => {
    try {
        let sql = `SELECT tbl_historia_curta.id, tbl_historia_curta.titulo
        
        FROM tbl_historia_curta
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_historia_curta.id_usuario
         
        WHERE tbl_historia_curta.id_usuario = ${shortStorieId} AND tbl_historia_curta.status = false`

        const rsShortStorie = await prisma.$queryRawUnsafe(sql)

        if(rsShortStorie.length > 0)
            return rsShortStorie
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectActivatedShortStories = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium, tbl_historia_curta.avaliacao
        FROM tbl_historia_curta
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_historia_curta.id_usuario
            
        WHERE tbl_usuario.id = ${userId} AND tbl_historia_curta.status = true
        ORDER BY tbl_historia_curta.id DESC`

        const rsActivatedShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsActivatedShortStories.length > 0)
            return rsActivatedShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectDesactivatedShortStories = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium, tbl_historia_curta.avaliacao
        FROM tbl_historia_curta
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_historia_curta.id_usuario
            
        WHERE tbl_usuario.id = ${userId} AND tbl_historia_curta.status = false
        ORDER BY tbl_historia_curta.id DESC`

        const rsDesactivatedShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsDesactivatedShortStories.length > 0)
            return rsDesactivatedShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStoriesByGenresUser = async (genresId) => {
    try {
        let sql = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium, tbl_historia_curta.avaliacao
        FROM tbl_genero_historia_curta
     
        INNER JOIN tbl_historia_curta
           ON tbl_historia_curta.id = tbl_genero_historia_curta.id_historia_curta
        INNER JOIN tbl_generos
           ON tbl_generos.id = tbl_genero_historia_curta.id_genero
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_historia_curta.id_usuario
     
        WHERE tbl_genero_historia_curta.id_genero in(${genresId}) AND tbl_historia_curta.status = true
        ORDER BY tbl_historia_curta.id DESC`

        const rsShortStoriesByGenresIds = await prisma.$queryRawUnsafe(sql)

        if(rsShortStoriesByGenresIds.length > 0)
            return rsShortStoriesByGenresIds
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStoriesByGenres = async (genresNames) => {
    try {
        let sql = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium, tbl_historia_curta.avaliacao
        FROM tbl_genero_historia_curta
     
        INNER JOIN tbl_historia_curta
           ON tbl_historia_curta.id = tbl_genero_historia_curta.id_historia_curta
        INNER JOIN tbl_generos
           ON tbl_generos.id = tbl_genero_historia_curta.id_genero
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_historia_curta.id_usuario
     
        WHERE tbl_generos.nome in(${genresNames}) AND tbl_historia_curta.status = true
        ORDER BY tbl_historia_curta.id DESC`

        const rsShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsShortStories.length > 0)
            return rsShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStoriesByGenresName = async (genreName) => {
    try {
        let sql = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium, tbl_historia_curta.avaliacao
        FROM tbl_genero_historia_curta
     
        INNER JOIN tbl_historia_curta
           ON tbl_historia_curta.id = tbl_genero_historia_curta.id_historia_curta
        INNER JOIN tbl_generos
           ON tbl_generos.id = tbl_genero_historia_curta.id_genero
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_historia_curta.id_usuario
     
        WHERE LOCATE('${genreName}', tbl_generos.nome) AND tbl_historia_curta.status = true
        ORDER BY tbl_historia_curta.id DESC`

        const rsShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsShortStories.length > 0)
            return rsShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStorieByTitleName = async (shortStorieTitle) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) as id, titulo, sinopse, capa, status, historia, data, premium, avaliacao FROM tbl_historia_curta WHERE LOCATE('${shortStorieTitle}', titulo) AND tbl_historia_curta.status = true`

        const rsShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsShortStories.length > 0)
            return rsShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStorieByGenreName = async (genreNames) => { // Esse será usado no filtro que poderá chegar diversos gêneros diferentes
    try {
        let sql = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium, tbl_historia_curta.avaliacao
        FROM tbl_genero_historia_curta
     
        INNER JOIN tbl_historia_curta
           ON tbl_historia_curta.id = tbl_genero_historia_curta.id_historia_curta
        INNER JOIN tbl_generos
           ON tbl_generos.id = tbl_genero_historia_curta.id_genero
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_historia_curta.id_usuario
     
        WHERE tbl_generos.nome in(${genreNames}) AND tbl_historia_curta.status = true
        ORDER BY tbl_historia_curta.id DESC`
        
        const rsShortStories = await prisma.$queryRawUnsafe(sql)
        
        if(rsShortStories.length > 0)
            return rsShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStoriesByFollowingUsers = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium, tbl_historia_curta.avaliacao
        FROM tbl_seguidor_seguidores
          
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_seguidor_seguidores.id_seguidor
        INNER JOIN tbl_historia_curta
           ON tbl_usuario.id = tbl_historia_curta.id_usuario
          
           WHERE tbl_seguidor_seguidores.id_segue = ${userId} AND tbl_historia_curta.status = true`

        const rsAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncements.length > 0)
            return rsAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStoriesByFilters = async (genresName, shortStorieTitle, bestRated) => {
    try {
        let sqlFrom = 'tbl_historia_curta'
        let sqlWhere = 'tbl_historia_curta.status = true'
        let sqlOrderBy = 'ORDER BY tbl_historia_curta.id DESC'

        if(genresName != "") {
            sqlFrom = `tbl_genero_historia_curta
            
            INNER JOIN tbl_historia_curta
                ON tbl_historia_curta.id = tbl_genero_historia_curta.id_historia_curta
            INNER JOIN tbl_generos
                ON tbl_generos.id = tbl_genero_historia_curta.id_genero
            INNER JOIN tbl_usuario
                ON tbl_usuario.id = tbl_historia_curta.id_usuario`

            sqlWhere += ` AND tbl_generos.nome in(${genresName})`
        }

        if(bestRated)
            sqlOrderBy = 'ORDER BY tbl_historia_curta.avaliacao DESC'

        if(shortStorieTitle != "")
            sqlWhere += ` AND LOCATE('${shortStorieTitle}', tbl_historia_curta.titulo)`

        let sqlBase = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium, tbl_historia_curta.avaliacao
        FROM ${sqlFrom}
        
        WHERE ${sqlWhere}
        ${sqlOrderBy}`

        console.log(sqlBase)

        const rsShortStories = await prisma.$queryRawUnsafe(sqlBase)

        if(rsShortStories.length > 0)
            return rsShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertShortStorie,
    updateShortStorie,
    deleteShortStorie,
    selectAllShortStories,
    desactivateShortStorie,
    activateShortStorie,
    selectUserByShortStorieId,
    selectPublicationTypeByShortStorieId,
    selectShortStorieById,
    selectShortStorieByUserId,
    selectShortStoriesActiveByUserId,
    selectShortStoriesDeactiveByUserId,
    selectActivatedShortStories,
    selectDesactivatedShortStories,
    selectShortStoriesByGenresUser,
    selectShortStoriesByGenres,
    selectShortStoriesByGenresName,
    selectShortStorieByTitleName,
    selectShortStorieByGenreName,
    selectShortStoriesByFollowingUsers,
    selectShortStoriesByFilters
}