require('dotenv').config()
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {

    let opt;
    const busquedas = new Busquedas();

    do {

        opt = await inquirerMenu();
        console.log({ opt });

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                // Buscar lugares
                const lugares = await busquedas.ciudad(lugar);
                // Seleccionar el lugar
                const id = await listarLugares(lugares);

                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);

                //Guardar BD
                busquedas.agregarHistorial(lugarSel.nombre);

                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                // Mostrar resultados

                console.log('\nInformación de la Ciudad \n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('El clima está:', clima.desc.green);

                break;

            case 2:

                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })

                break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0)
}

main();