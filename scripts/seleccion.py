"""
Selección curada del catálogo de Drive.

Elegida mirando las hojas de contacto (scripts/hoja-contacto.py). Cuando una
ciudad tenía varias fotos se prefirió, en este orden:

  1. Que muestre la tira de colores disponibles abajo (le ahorra la pregunta
     "¿en qué colores viene?" al cliente).
  2. Composición limpia: una prenda centrada, cartel de la marca visible.
  3. Mayor resolución.

Formato: 'archivo en Drive' -> (nombre visible del producto, categoría)
"""

# Una foto por ciudad. Se descartaron las versiones repetidas.
CIUDADES = {
    'Abancay 2.png': 'Abancay',
    'Abancaycito 2.png': 'Abancaycito',
    'Amazonas.png': 'Amazonas',
    'Ancashino.jpg': 'Ancashino',
    'Andahuaylas.jpg': 'Andahuaylas',
    'Aquia.png': 'Aquia',
    'Arequipa 2.png': 'Arequipa',
    'Ayacucho.png': 'Ayacucho',
    'Cajamarca 2.png': 'Cajamarca',
    'Callao 1.png': 'Callao',
    'Caraz 2.png': 'Caraz',
    'Cerro de Pasco 2.jpg': 'Cerro de Pasco',
    'Chachamayo.png': 'Chanchamayo',
    'Chavin 2.jpg': 'Chavín',
    'Chiclayo 2.png': 'Chiclayo',
    'Chimbote 3.png': 'Chimbote',
    'Chincha 2.jpg': 'Chincha',
    'Cuzco.png': 'Cusco',
    'Huacho.png': 'Huacho',
    'Huancavelica.png': 'Huancavelica',
    'Huancayo .jpg': 'Huancayo',
    'Huanuco.png': 'Huánuco',
    'Huaral.png': 'Huaral',
    'Huaraz 2.png': 'Huaraz',
    'Huarmey.jpg': 'Huarmey',
    'Ica 2.png': 'Ica',
    'Iquitos 2.png': 'Iquitos',
    'Juliaca 2.png': 'Juliaca',
    'Junin 2.png': 'Junín',
    'La Merced.png': 'La Merced',
    'Lamas.png': 'Lamas',
    'Lambayeque.png': 'Lambayeque',
    'Lima 6.png': 'Lima',
    'Luren.png': 'Luren',
    'Mancora 2.png': 'Máncora',
    'Mi Huaros Querido.png': 'Huaros',
    'Moquegua.jpg': 'Moquegua',
    'Moyobamba.png': 'Moyobamba',
    'Pacasmayo.png': 'Pacasmayo',
    'Paramonga 1.jpg': 'Paramonga',
    'Pasco.jpg': 'Pasco',
    'Paucartambo 2.png': 'Paucartambo',
    'Pisco}.png': 'Pisco',
    'Piura 2.png': 'Piura',
    'Pucallpa 2.png': 'Pucallpa',
    'Pucquio.png': 'Puquio',
    'Puno 3.png': 'Puno',
    'Tacna.png': 'Tacna',
    'Tarapoto 1.png': 'Tarapoto',
    'Tarapoto Chirapa.png': 'Tarapoto Chirapa',
    'Tarma.png': 'Tarma',
    'Tayagasha.png': 'Tayagasha',
    'Trujillo 2.png': 'Trujillo',
    'Tucume.png': 'Túcume',
    'Tumbes.png': 'Tumbes',
    'Vilcas Huaman.jpg': 'Vilcas Huamán',
    'Yungay.png': 'Yungay',
    'Zarumilla.png': 'Zarumilla',
}

# Colecciones mundialistas. Las fotos "pareja" son las mejores: muestran el
# modelo de hombre y de mujer juntos.
MUNDIALES = {
    'Alemania 74 Pareja.png': 'Alemania 74',
    'Argentina 78 pareja.png': 'Argentina 78',
    'España 82 pareja.png': 'España 82',
    'Francia 98 Parejas.png': 'Francia 98',
    'Italia 90 Pareja.png': 'Italia 90',
    'Mexico 86 pareja.png': 'México 86',
}

# Equipos de fútbol (estaba mal guardado dentro de Ciudades).
EQUIPOS = {
    'Alianza Lima 2.png': 'Alianza Lima',
}

# Diseños que no son de ciudad ni mundial.
VARIOS = {
    'Cuidado con los humanos.png': 'Cuidado con los Humanos',
}

# Imágenes que NO son producto pero sirven para secciones del sitio.
APOYO = {
    'Poleras 2.jpg': 'coleccion-ciudades',   # percha con muchas ciudades
    'Regalo 4.jpg': 'regalo',                # caja de regalo con la prenda
}

CARPETAS = {
    'Ciudades': [CIUDADES, EQUIPOS, VARIOS],
    'Mundiales': [MUNDIALES],
}
