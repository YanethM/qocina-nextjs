import styles from "./page.module.css";

export const metadata = {
  title: "Políticas de Cookies | Q'ocina en Casa",
  description: "Conoce cómo Q'ocina en Casa utiliza cookies en su sitio web.",
};

export default function PoliticasCookiesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Políticas de Cookies</h1>
        <p className={styles.updated}>Última actualización: marzo 2025</p>

        <section className={styles.section}>
          <h2 className={styles.heading}>¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador,
            tablet o móvil) cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones
            y preferencias durante un período de tiempo, para que no tengas que volver a introducirlas
            cada vez que regreses al sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>¿Qué cookies utilizamos?</h2>

          <h3 className={styles.subheading}>Cookies estrictamente necesarias</h3>
          <p>
            Son imprescindibles para el funcionamiento del sitio web. Sin ellas, servicios como el
            carrito de compras o el proceso de pago no podrían funcionar correctamente. No requieren
            tu consentimiento para ser activadas.
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>qocina_cart</td>
                <td>Q'ocina en Casa</td>
                <td>Almacena los productos añadidos al carrito de compra</td>
                <td>Sesión / persistente</td>
              </tr>
              <tr>
                <td>qocina_cookie_consent</td>
                <td>Q'ocina en Casa</td>
                <td>Guarda tu preferencia de consentimiento de cookies</td>
                <td>1 año</td>
              </tr>
              <tr>
                <td>locale</td>
                <td>Q'ocina en Casa</td>
                <td>Recuerda el idioma seleccionado por el usuario</td>
                <td>1 año</td>
              </tr>
            </tbody>
          </table>

          <h3 className={styles.subheading}>Cookies analíticas</h3>
          <p>
            Nos permiten conocer cómo interactúan los visitantes con el sitio web, recopilando
            información de forma anónima. Con estos datos podemos mejorar el funcionamiento del
            sitio.
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Analytics</td>
                <td>Registra un identificador único para generar datos estadísticos</td>
                <td>2 años</td>
              </tr>
              <tr>
                <td>_ga_*</td>
                <td>Google Analytics</td>
                <td>Mantiene el estado de sesión</td>
                <td>2 años</td>
              </tr>
            </tbody>
          </table>

          <h3 className={styles.subheading}>Cookies de marketing</h3>
          <p>
            Se utilizan para rastrear a los visitantes en los sitios web y mostrar anuncios
            relevantes y atractivos para el usuario individual. Estas cookies solo se activarán si
            aceptas todas las cookies.
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_fbp</td>
                <td>Meta (Facebook)</td>
                <td>Identifica navegadores para proporcionar servicios publicitarios</td>
                <td>3 meses</td>
              </tr>
              <tr>
                <td>_ttp</td>
                <td>TikTok</td>
                <td>Mide el rendimiento de campañas publicitarias en TikTok</td>
                <td>13 meses</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>¿Cómo gestionar las cookies?</h2>
          <p>
            Puedes controlar y/o eliminar las cookies cuando lo desees. Tienes la opción de eliminar
            todas las cookies que ya están en tu equipo y configurar la mayoría de los navegadores
            para que no se almacenen. Sin embargo, si haces esto, es posible que tengas que ajustar
            manualmente algunas preferencias cada vez que visites un sitio y que algunos servicios y
            funcionalidades no funcionen correctamente.
          </p>
          <p>A continuación encontrarás los enlaces para gestionar las cookies en los principales navegadores:</p>
          <ul className={styles.list}>
            <li>
              <strong>Google Chrome:</strong>{" "}
              Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios
            </li>
            <li>
              <strong>Mozilla Firefox:</strong>{" "}
              Opciones &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio
            </li>
            <li>
              <strong>Safari:</strong>{" "}
              Preferencias &gt; Privacidad &gt; Gestionar datos de sitios web
            </li>
            <li>
              <strong>Microsoft Edge:</strong>{" "}
              Configuración &gt; Privacidad, búsqueda y servicios &gt; Cookies
            </li>
          </ul>
          <p>
            También puedes gestionar tu preferencia en cualquier momento haciendo clic en el banner
            de cookies que aparece al visitar nuestro sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Actualizaciones de esta política</h2>
          <p>
            Podemos actualizar nuestra política de cookies de vez en cuando para reflejar cambios en
            las cookies que utilizamos o por otras razones operativas, legales o reglamentarias.
            Te recomendamos que revises esta página periódicamente para mantenerte informado sobre el
            uso de cookies.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre nuestro uso de cookies, puedes ponerte en contacto con
            nosotros a través de nuestra{" "}
            <a href="/contacto" className={styles.link}>
              página de contacto
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
