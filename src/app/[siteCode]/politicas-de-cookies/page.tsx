import styles from "./page.module.css";
import { getLocale } from "@/lib/locale";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "en") {
    return {
      title: "Cookie Policy | Q'ocina en Casa",
      description: "Learn how Q'ocina en Casa uses cookies on its website.",
    };
  }
  return {
    title: "Política de Cookies | Q'ocina en Casa",
    description: "Conoce cómo Q'ocina en Casa utiliza cookies en su sitio web.",
  };
}

export default async function PoliticasCookiesPage() {
  const locale = await getLocale();

  if (locale === "en") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.company}>QOCINA EN CASA</p>
          <h1 className={styles.title}>Cookie Policy</h1>
          <p className={styles.updated}>Last updated: March 19, 2026</p>

          <section className={styles.section}>
            <p>
              At Qocina en Casa, we believe the best recipes turn out well when there&rsquo;s
              transparency in the ingredients. That&rsquo;s why we want to explain how we use
              &ldquo;cookies&rdquo; on our website{" "}
              <a href="https://qocinaencasa.com/us/" className={styles.link}>
                https://qocinaencasa.com/us/
              </a>
              .
            </p>
            <p>
              Just like a pinch of salt enhances the flavor, our cookies are here to make your
              browsing experience much tastier and smoother.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>1. What is a cookie?</h2>
            <p>
              No, they&rsquo;re not the chocolate kind that comes out of the oven (although we&rsquo;d
              love that). A cookie is a small text file that gets downloaded onto your device when
              you visit certain web pages. They allow a site to, among other things, remember your
              preferences, know whether you&rsquo;ve visited before, and improve loading speed.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>2. What types of cookies do we use?</h2>
            <p>For our digital kitchen to run smoothly, we use the following types:</p>
            <p>
              <strong>Technical (Essential) Cookies:</strong> These are the basic ingredients.
              Without them, the site wouldn&rsquo;t work (for example, to keep your session open or
              remember the products in your cart).
            </p>
            <p>
              <strong>Personalization Cookies:</strong> These help us remember your preferences
              (such as language or your region in the US) so you don&rsquo;t have to set everything
              up again each time you visit.
            </p>
            <p>
              <strong>Analytics Cookies:</strong> These tell us which recipes or sections are our
              community&rsquo;s favorites. We use tools like Google Analytics to understand how to
              improve the service.
            </p>
            <p>
              <strong>Advertising/Marketing Cookies:</strong> If you&rsquo;ve ever seen one of our
              ads on social media about that cooking kit you liked so much, it&rsquo;s thanks to
              these cookies.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>3. How can you control your cookies?</h2>
            <p>
              You hold the pan by the handle. You can block or delete the cookies installed on your
              device through your browser settings:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Chrome:</strong> Settings &rarr; Privacy and security &rarr; Cookies and
                other site data.
              </li>
              <li>
                <strong>Safari:</strong> Preferences &rarr; Privacy &rarr; Block all cookies.
              </li>
              <li>
                <strong>Firefox:</strong> Options &rarr; Privacy &amp; Security &rarr; Cookies and
                Site Data.
              </li>
            </ul>
            <p>
              Keep in mind that if you decide to disable some cookies, certain features of our
              website may not be served &ldquo;to your taste&rdquo; or may stop working properly.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>4. Policy updates</h2>
            <p>
              Sometimes we tweak our recipe. Any change to this policy will be posted here along
              with the date of the last update.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>5. Have questions?</h2>
            <p>
              If you&rsquo;d like to know more about how we handle your data, you can reach our
              Customer Service team Monday through Friday from 9:00 a.m. to 6:00 p.m. and Saturdays
              from 9:00 a.m. to 2:00 p.m., via WhatsApp chat at{" "}
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
