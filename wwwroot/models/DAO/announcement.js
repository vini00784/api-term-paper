/*
    Objetivo:     API responsible for handling announcements (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertAnnouncement = async (announcement, genresId) => {
    try {
        let sql = `CALL proc_insert_anuncio (
                                                '${announcement.titulo}', 
                                                ${announcement.volume}, 
                                                '${announcement.capa}', 
                                                ${announcement.status}, 
                                                ${announcement.premium},
                                                '${announcement.sinopse}',
                                                '${announcement.data}',
                                                ${announcement.quantidade_paginas},
                                                ${announcement.preco},
                                                '${announcement.pdf}',
                                                '${announcement.epub}',
                                                '${announcement.mobi}',
                                                ${announcement.id_classificacao},
                                                ${announcement.id_usuario},
                                                ${announcement.id_tipo_publicacao},
                                                '${genresId}'
                                                )`
                        
        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const updateAnnouncement = async (announcement, genresId) => {
    try {
        let sql = `CALL proc_update_anuncio (
            ${announcement.id},
            '${announcement.titulo}', 
            ${announcement.volume}, 
            '${announcement.capa}', 
            '${announcement.sinopse}',
            '${announcement.data}',
            ${announcement.quantidade_paginas},
            ${announcement.preco},
            '${announcement.pdf}',
            '${announcement.epub}',
            '${announcement.mobi}',
            ${announcement.id_classificacao},
            ${announcement.id_usuario},
            ${announcement.id_tipo_publicacao},
            '${genresId}'
        )`

        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteAnnouncement = async (announcementId) => {
    try {
        let sql = `DELETE FROM tbl_anuncio WHERE id = ${announcementId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAllAnnouncements = async () => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) as id, titulo, volume, capa, status, premium, sinopse, data, quantidade_paginas, preco, pdf, epub, mobi, avaliacao FROM tbl_anuncio ORDER BY id DESC`

        const rsAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncements.length > 0)
            return rsAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona todos os anúncios referidos a um certo usuário
const selectAnnouncementByUserId = async (userId) => {
    try {
        let sql = `SELECT tbl_anuncio.id, tbl_anuncio.titulo
        
        FROM tbl_anuncio
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_anuncio.id_usuario
         
        WHERE tbl_anuncio.id_usuario = ${userId}`

        const rsAnnouncement = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncement.length > 0)
            return rsAnnouncement
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona todos os anúncios ativos referidos a um certo usuário
const selectAnnouncementAtiveByUserId = async (userId) => {
    try {
        let sql = `SELECT tbl_anuncio.id, tbl_anuncio.titulo
        
        FROM tbl_anuncio
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_anuncio.id_usuario
         
        WHERE tbl_anuncio.id_usuario = ${userId} AND tbl_anuncio.status = true`

        const rsAnnouncement = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncement.length > 0)
            return rsAnnouncement
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona todos os anúncios desativados referidos a um certo usuário
const selectAnnouncementDeactivateByUserId = async (userId) => {
    try {
        let sql = `SELECT tbl_anuncio.id, tbl_anuncio.titulo
        
        FROM tbl_anuncio
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_anuncio.id_usuario
         
        WHERE tbl_anuncio.id_usuario = ${userId} AND tbl_anuncio.status = false`

        const rsAnnouncement = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncement.length > 0)
            return rsAnnouncement
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona apenas o usuário vinculado a tal anúncio
const selectUserByAnnouncementId = async (announcementId) => {
    try {
        let sql = `SELECT cast(tbl_usuario.id AS DECIMAL) as id_usuario, tbl_usuario.nome as nome_usuario, tbl_usuario.user_name, tbl_usuario.foto
        FROM tbl_anuncio
     
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_anuncio.id_usuario
     
        WHERE tbl_anuncio.id = ${announcementId}`

        const rsUser = await prisma.$queryRawUnsafe(sql)

        if(rsUser.length > 0)
            return rsUser
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectPublicationTypeByAnnouncementId = async (announcementId) => {
    try {
        let sql = `SELECT cast(tbl_tipo_publicacao.id AS DECIMAL) as id_tipo_publicacao, tbl_tipo_publicacao.tipo
        FROM tbl_anuncio
     
        INNER JOIN tbl_tipo_publicacao
           ON tbl_tipo_publicacao.id = tbl_anuncio.id_tipo_publicacao
     
        WHERE tbl_anuncio.id = ${announcementId}`

        const rsPublicationType = await prisma.$queryRawUnsafe(sql)

        if(rsPublicationType.length > 0)
            return rsPublicationType
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const desactivateAnnouncement = async (announcementId) => {
    try {
        let sql = `UPDATE tbl_anuncio SET status = false WHERE id = ${announcementId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const activateAnnouncement = async (announcementId) => {
    try {
        let sql = `UPDATE tbl_anuncio SET status = true WHERE id = ${announcementId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAnnouncementById = async (announcementId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) as id, titulo, volume, capa, status, premium, sinopse, data, quantidade_paginas, preco, pdf, epub, mobi, avaliacao FROM tbl_anuncio WHERE id = ${announcementId}`

        const rsAnnouncement = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncement.length > 0)
            return rsAnnouncement
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectActivatedAnnouncements = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao
        FROM tbl_anuncio
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_anuncio.id_usuario
            
        WHERE tbl_usuario.id = ${userId} AND tbl_anuncio.status = true
        ORDER BY tbl_anuncio.id DESC`

        const rsActivatedAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsActivatedAnnouncements.length > 0)
            return rsActivatedAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectDesactivatedAnnouncements = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao
        FROM tbl_anuncio
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_anuncio.id_usuario
            
        WHERE tbl_usuario.id = ${userId} AND tbl_anuncio.status = false
        ORDER BY tbl_anuncio.id DESC`

        const rsDesactivatedAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsDesactivatedAnnouncements.length > 0)
            return rsDesactivatedAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAnnouncementsByGenres = async (genresId) => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao
        FROM tbl_genero_anuncio
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_genero_anuncio.id_anuncio
        INNER JOIN tbl_generos
           ON tbl_generos.id = tbl_genero_anuncio.id_genero
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_anuncio.id_usuario
     
        WHERE tbl_genero_anuncio.id_genero in(${genresId}) AND tbl_anuncio.status = true
        ORDER BY tbl_anuncio.id DESC`

        const rsAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncements.length > 0)
            return rsAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona todos os anúncios referidos a determinados parametros de filtros
const selectAnnouncementsByFilters = async (genresNames, minPrice, maxPrice, bestRated, announcementTitle) => {
    try {
        let sqlFrom = "tbl_anuncio"
        let sqlWhere = "tbl_anuncio.status = true"
        let sqlOrderBy = "ORDER BY tbl_anuncio.id DESC"

        if (genresNames != "") {
            sqlFrom = `tbl_genero_anuncio
     
            INNER JOIN tbl_anuncio
               ON tbl_anuncio.id = tbl_genero_anuncio.id_anuncio
            INNER JOIN tbl_generos
               ON tbl_generos.id = tbl_genero_anuncio.id_genero
            INNER JOIN tbl_usuario
               ON tbl_usuario.id = tbl_anuncio.id_usuario`

            sqlWhere += ` AND tbl_generos.nome in(${genresNames})`
        }

        if (minPrice != "")
            sqlWhere += ` AND tbl_anuncio.preco >= ${minPrice}`

        if (maxPrice != "")
            sqlWhere += ` AND tbl_anuncio.preco <= ${maxPrice}`

        if(bestRated)
            sqlOrderBy = `ORDER BY tbl_anuncio.avaliacao DESC`

        if(announcementTitle != "")
            sqlWhere += ` AND LOCATE('${announcementTitle}', tbl_anuncio.titulo)`

        let sqlBase = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao
        FROM ${sqlFrom}
     
        WHERE ${sqlWhere}
        ${sqlOrderBy}`

        const rsAnnouncement = await prisma.$queryRawUnsafe(sqlBase)

        if(rsAnnouncement.length > 0)
            return rsAnnouncement
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAnnouncementsByFollowingUsers = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao
        FROM tbl_seguidor_seguidores
          
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_seguidor_seguidores.id_seguidor
        INNER JOIN tbl_anuncio
           ON tbl_usuario.id = tbl_anuncio.id_usuario
          
           WHERE tbl_seguidor_seguidores.id_segue = ${userId} AND tbl_anuncio.status = true`

        const rsAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncements.length > 0)
            return rsAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAnnouncementsByPurchasesCount = async () => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao, cast(count(tbl_livros_comprados.id) AS DECIMAL) AS quantidade_vendas
        FROM tbl_livros_comprados
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio
     
        GROUP BY tbl_anuncio.id
        ORDER BY quantidade_vendas DESC`

        const rsMostPurchasedAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsMostPurchasedAnnouncements.length > 0)
            return rsMostPurchasedAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAnnouncementsByLikesCount = async () => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi, tbl_anuncio.avaliacao, cast(count(tbl_anuncio_curtida.id) AS DECIMAL) as quantidade_curtidas
        FROM tbl_anuncio_curtida
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_anuncio_curtida.id_anuncio
     
        GROUP BY tbl_anuncio.id
        ORDER BY quantidade_curtidas DESC`

        const rsMostLikedAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsMostLikedAnnouncements.length > 0)
            return rsMostLikedAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    selectAllAnnouncements,
    selectAnnouncementByUserId,
    selectAnnouncementAtiveByUserId,
    selectAnnouncementDeactivateByUserId,
    selectUserByAnnouncementId,
    selectPublicationTypeByAnnouncementId,
    desactivateAnnouncement,
    activateAnnouncement,
    selectAnnouncementById,
    selectActivatedAnnouncements,
    selectDesactivatedAnnouncements,
    selectAnnouncementsByGenres,
    selectAnnouncementsByFilters,
    selectAnnouncementsByFollowingUsers,
    selectAnnouncementsByPurchasesCount,
    selectAnnouncementsByLikesCount
}