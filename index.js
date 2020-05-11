$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

var app = new Vue({
  el: '#app',
  data: {
    cards: [{
        img: 'https://i.ibb.co/Z8B2G25/cursos-sobre-programacion.jpg',
        title: 'Programación Web',
        description: 'Desarrollo, mejoras y actualización de plataformas  usando las tecnologías de VueJs, Angular, Laravel.'
      },
      {
        img: 'https://i.ibb.co/KGJpXx0/software-testing.png',
        title: 'Testing',
        description: 'Pruebas de garantía de calidad para descubrir errores y optimizar la usabilidad.'
      },
      {
        img: 'https://i.ibb.co/8rt2J27/product-500x500.jpg',
        title: 'Microsoft Office',
        description: ' Análisis y desarrollo de sistemas y aplicativos a medida Construidos en Excel (VBA, macros) y Access.'
      },
      {
        img: 'https://i.ibb.co/P6sgKpf/1495579893-25.png',
        title: 'Soporte al Usuario',
        description: 'Atención a usuarios (consultas, información general, resolución de problemas), Instalación y mantenimiento de S.O'
      }
    ],
    certificates: [{
        img: 'https://storage.googleapis.com/icemdweb-wp-uploads/2017/11/34954f15-marketing-digital-empresas.jpg',
        title: 'Sql Server 2008',
        fecha: '26 de Abril del 2020',
        description: 'Marketing Digital',
        link: 'https://drive.google.com/file/d/1pBgzKpF8Ouim67Cxlg6rwbndIxSQxN_I/view?usp=sharing'
      },
      {
        img: 'https://corporacioninformatica.com/wp-content/uploads/2015/01/curso-online-de-programacion-web.jpg',
        title: 'Programacion Web',
        fecha: '20 de Mayo del 2019',
        description: '',
        link: 'https://drive.google.com/file/d/1PtP0L0ej2ok5Tdq8RKsTlrbisrD6gffs/view?usp=sharing'
      },
      {
        img: 'data:image/jpeg;base64,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',
        title: 'Curso de Capacitaciòn y Actualizaciòn.',
        fecha: '21 de Agosto del 2018',
        description: 'Programación en Php, Modelamiento en Base de datos, Analisis y Diseño de Sistemas',
        link: 'https://drive.google.com/file/d/1StPXMr7Hz7KTaFrwUsJivYTGO4uVpilk/view?usp=sharing'
      },
      {
        img: 'http://imagenes.universia.net/gc/net/images/educacion/c/cu/cur/curso-online-gratuito-mejorar-habilidades-conversacion-ingles.jpg',
        title: 'Ingles',
        fecha: '01 de Agosto del 2018',
        description: 'The Basic english course level',
        link: 'https://drive.google.com/file/d/1nNsYWF9lFZupTARFL6HZgx8gcNfTwnLJ/view?usp=sharing'
      },
      {
        img: 'http://i.eldiario.com.ec/fotos-manabi-ecuador/2019/04/20190402085423_la-tecnologa-a-herramienta-clave-pa.jpg',
        title: 'In Full Dat Tec.',
        fecha: '24 de Octubre del  2017',
        description: 'Enfoque al futuro sobre el acceso al conocimiento, Delitos Informaticos, Negocios en redes social y Bitcoins',
        link: 'https://drive.google.com/file/d/1TkB2lktBOm3IA-4TNVRTKJYSoOlSH32H/view?usp=sharing'
      },
      {
        img: 'https://i2.wp.com/www.universidadescr.com/blog/wp-content/uploads/cisco.jpg?fit=860%2C365&ssl=1',
        title: 'Cisco - Internet del Todo',
        fecha: '21 de Octubre del 2017',
        description: 'Beneficios y desafios del Internet, Modelos y de prototipos en IdT',
        link: 'https://drive.google.com/file/d/1QO-NVrqZgYYOu1gqPaR1kdlK607Metji/view?usp=sharing'
      },
      {
        img: 'http://www.panoramaaudiovisual.com/wp-content/uploads/2015/10/SQL-Server.jpg',
        title: 'Sql Server 2008',
        fecha: '30 de Noviembre del 2016',
        description: 'Normalisacion de Base de datos, Diseño de consultas, Agrupación y resúmenes de datos, Valores de Agregación',
        link: 'https://drive.google.com/file/d/1wITDW9RQ6qP47ZJYka4WkOxVWWru5Ms_/view?usp=sharing'
      },
      {
        img: 'https://soyofimatica.com/wp-content/uploads/2018/10/descargar-excel.jpg',
        title: 'Excel Avanzado',
        fecha: '25 de Septiembre del 2016',
        description: 'Formulas, Funciones, Tablas dinámicas, Herramientas de datos, Formularios, Programación Vba',
        link: 'https://drive.google.com/file/d/1IUUVSR3YXzs-fcInfIN6kmBNfFjssRNr/view?usp=sharing'
      }
    ]
  }
})