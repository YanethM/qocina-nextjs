import styles from "./page.module.css";

export const metadata = {
  title: "Política de Cookies | Q'ocina en Casa",
  description: "Conoce cómo Q'ocina en Casa utiliza cookies en su sitio web.",
};

export default function PoliticasCookiesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p className={styles.company}>QOCINA EN CASA</p>
        <h1 className={styles.title}>Política de cookies</h1>
        <p className={styles.updated}>Última actualización: 19 de marzo de 2026</p>

        <section className={styles.section}>
          <p>
            En Qocina en Casa, creemos que las mejores recetas salen bien cuando hay transparencia
            en los ingredientes. Por eso, queremos explicarte cómo usamos las &ldquo;cookies&rdquo;
            en nuestro sitio web{" "}
            <a href="https://qocinaencasa.com/us/" className={styles.link}>
              https://qocinaencasa.com/us/
            </a>
            .
          </p>
          <p>
            Al igual que una pizca de sal realza el sabor, nuestras cookies están aquí para que tu
            experiencia de navegación sea mucho más sabrosa y fluida.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>1. ¿Qué es una cookie?</h2>
          <p>
            No, no son las de chocolate que salen del horno (aunque nos encantaría). Una cookie es
            un pequeño archivo de texto que se descarga en tu equipo al acceder a ciertas páginas
            web. Permiten a un sitio, entre otras cosas, recordar tus preferencias, saber si ya nos
            has visitado y mejorar la velocidad de carga.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>2. ¿Qué tipos de cookies utilizamos?</h2>
          <p>
            Para que nuestra cocina digital funcione a la perfección, usamos los siguientes tipos:
          </p>
          <p>
            <strong>Cookies Técnicas (Esenciales):</strong> Son los ingredientes básicos. Sin ellas,
            el sitio no funcionaría (por ejemplo, para mantener tu sesión abierta o recordar los
            productos en tu carrito).
          </p>
          <p>
            <strong>Cookies de Personalización:</strong> Nos ayudan a recordar tus preferencias
            (como el idioma o tu región en US) para que no tengas que configurar todo cada vez que
            entres.
          </p>
          <p>
            <strong>Cookies de Análisis:</strong> Estas nos dicen qué recetas o secciones son las
            favoritas de nuestra comunidad. Usamos herramientas como Google Analytics para entender
            cómo mejorar el servicio.
          </p>
          <p>
            <strong>Cookies de Publicidad/Marketing:</strong> Si alguna vez ves un anuncio nuestro
            en redes sociales sobre ese kit de cocina que tanto te gustó, es gracias a estas
            cookies.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>3. ¿Cómo puedes controlar tus cookies?</h2>
          <p>
            Tú tienes el sartén por el mango. Puedes bloquear o eliminar las cookies instaladas en
            tu equipo mediante la configuración de las opciones de tu navegador:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Chrome:</strong> Configuración &rarr; Privacidad y seguridad &rarr; Cookies y
              otros datos de sitios.
            </li>
            <li>
              <strong>Safari:</strong> Preferencias &rarr; Privacidad &rarr; Bloquear todas las
              cookies.
            </li>
            <li>
              <strong>Firefox:</strong> Opciones &rarr; Privacidad y Seguridad &rarr; Cookies y
              datos del sitio.
            </li>
          </ul>
          <p>
            Ten en cuenta que, si decides desactivar algunas cookies, es posible que algunas
            funciones de nuestra web no se sirvan &ldquo;en su punto&rdquo; o dejen de funcionar
            correctamente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>4. Actualizaciones de la Política</h2>
          <p>
            A veces ajustamos nuestra receta. Cualquier cambio en esta política será publicado aquí
            con la fecha de la última actualización.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>5. ¿Tienes dudas?</h2>
          <p>
            Si quieres saber más sobre cómo manejamos tus datos, puedes comunicarte con nuestro
            Servicio al cliente de lunes a viernes desde las 09:00 a 18:00 horas y los sábados de
            9:00 a 14:00 horas, mediante el chat de whatsapp al número{" "}
            <a href="https://wa.me/51986867611" className={styles.link}>
              986 867 611
            </a>
            .
          </p>
        </section>

        <p className={styles.footer}>QOCINA EN CASA</p>
      </div>
    </div>
  );
}
