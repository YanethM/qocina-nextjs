import styles from "./page.module.css";
import { getLocale } from "@/lib/locale";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "en") {
    return {
      title: "Terms and Conditions | Q'ocina en Casa",
      description:
        "Terms and Conditions of the Q'ocina en Casa Online Store by FuXion Biotech S.A.C.",
    };
  }
  return {
    title: "Términos y Condiciones | Q'ocina en Casa",
    description:
      "Términos y Condiciones de la Tienda Online Q'ocina en Casa de FuXion Biotech S.A.C.",
  };
}

export default async function PoliticasPrivacidadPage() {
  const locale = await getLocale();

  if (locale === "en") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.company}>FUXION BIOTECH S.A.C.</p>
          <h1 className={styles.title}>Terms and Conditions</h1>
          <p className={styles.subtitle}>
            Terms and Conditions of the Q&apos;ocina en Casa Online Store
          </p>

          <section className={styles.section}>
            <p>
              Access to and use of the online shopping service of the &ldquo;Q&apos;ocina en
              Casa&rdquo; virtual store operated by FuXion Biotech S.A.C. (hereinafter FUXION) is
              subject to Peruvian law and is intended exclusively for residents of the Republic of
              Peru. Users shall be subject to FUXION&apos;s General Terms and Conditions, together
              with all other policies and principles governing FUXION that are incorporated by
              reference; the contractual relationship between users (hereinafter, &ldquo;Users&rdquo;)
              and FUXION is governed by the following terms and conditions:
            </p>
            <p>
              The &ldquo;Q&apos;ocina en Casa&rdquo; virtual store operated by FUXION is a
              technological tool that, using the internet, provides a digital sales channel
              between FUXION as the SELLER and individuals who are not registered as
              &ldquo;Fuxion Entrepreneurs&rdquo; or as &ldquo;Customers&rdquo; in FUXION&apos;s
              database, who individually constitute the BUYER or USER.
            </p>
            <div className={styles.notice}>
              THE USER DECLARES TO HAVE READ AND UNDERSTOOD ALL THE CONDITIONS ESTABLISHED IN THE
              PRIVACY POLICY AND THESE TERMS AND CONDITIONS, AND EXPRESSES THEIR AGREEMENT AND
              ACCEPTANCE UPON REGISTERING AND/OR USING THE &ldquo;COMPRA FUXION&rdquo; VIRTUAL
              STORE. ANYONE WHO DOES NOT ACCEPT OR DISAGREES WITH THESE TERMS AND CONDITIONS,
              WHICH ARE MANDATORY AND BINDING, MUST REFRAIN FROM USING THE &ldquo;COMPRA
              FUXION&rdquo; VIRTUAL STORE.
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>First Clause</h2>
            <p>
              Access to the site is free, except for the cost of the internet connection provided
              by the access provider (ISP) contracted by the User, which shall be at the
              User&apos;s sole expense. The User may only access the site through authorized
              means.
            </p>
            <p>
              Registration as a User is not required to access the content of the Q&apos;OCINA EN
              CASA STORE. To complete a purchase, the BUYER must provide their full name, identity
              document number, email address, contact phone number, and the shipping address where
              they wish to receive their purchase.
            </p>
            <p>
              FUXION may use various means to identify Users, but is not responsible for the
              accuracy of the Personal Data that users or buyers make available to it. Each USER
              or BUYER guarantees and is responsible, in any case, for the truthfulness, accuracy,
              validity, and authenticity of the Personal Data made available to FUXION.
            </p>
            <p>
              Personal Data entered by the User must be accurate, current, and truthful at all
              times. FUXION reserves the right to request proof and/or additional information in
              order to verify Personal Data, and to temporarily and/or permanently suspend any
              Registered User whose data could not be confirmed. FUXION is NOT responsible for the
              accuracy of the data entered in the Registration.
            </p>
            <p>
              Our website has been developed to guarantee the confidentiality of the information
              provided by our customers.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Second Clause</h2>
            <p>
              Products offered on the site may be purchased through the available payment methods:
              PayU for online payments and SafetyPay for online banking and cash payments. Payment
              processing is subject to all terms, conditions, and privacy policies of each Payment
              Processor.
            </p>
            <p>
              If the bank does not approve the transaction after it has been made, or if we do not
              receive confirmation of it even when the transaction appears successful, FUXION is
              entitled to cancel the purchase and, in that case, a refund will be issued to the
              credit or debit card, as applicable. Likewise, FUXION is entitled to verify the data
              of the person who made the transaction through the &ldquo;COMPRA FUXION&rdquo;
              virtual store via a phone call (to the registered phone number), for security
              reasons or in case of suspected fraud; only if the corresponding data is confirmed
              will the sale be approved, otherwise the transaction will not proceed and the
              purchase amount will be refunded to the cardholder&apos;s debit or credit card.
            </p>
            <p className={styles.important}>
              IMPORTANT: FUXION will not reserve or set aside products until they have been paid
              for.
            </p>
            <p>
              If you make a payment for a product that is out of stock, you will be notified and
              refunded the cost of the product.
            </p>
            <p>
              For payments made through SafetyPay or Pago Efectivo, after choosing this option,
              keep the transaction number and amount to be paid. Then, log in to the website of
              the financial institution through which you will make the payment. Enter your card
              number and PIN, select the &ldquo;Pago de servicios&rdquo; option, and locate the
              &laquo;SafetyPay&raquo; or &ldquo;Pago Efectivo&rdquo; button. Enter the transaction
              number and the amount to be paid. You will then receive confirmation of your
              purchase.
            </p>
            <p>
              Payments made by credit card are subject to data evaluation and verification. For
              more details, contact us via WhatsApp chat at{" "}
              <a href="https://wa.me/51986867611" className={styles.link}>
                986 867 611
              </a>
              .
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Third Clause</h2>
            <p>
              Delivery Service rates are set by FUXION based on geographic location and delivery
              demand associated with the destination area. Delivery service rates will be included
              in the total amount to be paid, including General Sales Tax. Delivery Service fees
              are non-refundable.
            </p>
            <p>
              The recipient of the order must have a phone number available to coordinate delivery
              (time, place, person receiving it, recipient identification, etc.).
            </p>
            <p>
              Regardless of the payment method, the delivery person will require identification of
              the order recipient via their National Identity Document or foreign resident card,
              as applicable, as well as a signature on the delivery receipt. Orders will not be
              delivered to minors.
            </p>
            <p>
              THE Q&apos;OCINA EN CASA STORE is solely responsible for the quality of the products,
              as well as the quality of the delivery.
            </p>
            <p>
              Delivery options refer to Lima, Peru time. If you select a time outside the stated
              windows, our Customer Service representative will contact the recipient to indicate
              availability and coordinate delivery of the order.
            </p>
            <h3 className={styles.subheading}>
              Exchange and Return Policy, for purchases made at the Q&apos;OCINA EN CASA STORE
            </h3>
            <p>
              If for any reason you are not satisfied with your purchase at the Q&apos;OCINA EN
              CASA STORE, you may exchange or return your purchase in its original condition
              within the first 30 business days after the purchase is made.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Fourth Clause</h2>
            <p>
              FUXION will not be responsible if the User does not have a smartphone compatible
              with use of the site. The Registered User agrees to make appropriate and lawful use
              of the Application in accordance with applicable law, these Terms and Conditions,
              generally accepted morals and customs, and public order. By using the site, the User
              agrees that they will:
            </p>
            <ul className={styles.list}>
              <li>
                Not attempt to damage the site in any way, nor access restricted resources on the
                site.
              </li>
              <li>Not use the site with an incompatible or unauthorized device.</li>
              <li>
                Not attempt to access, use, and/or manipulate FUXION&apos;s data or that of other
                Users.
              </li>
              <li>
                Not introduce or spread computer viruses or any other physical or logical systems
                capable of causing damage to the site.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Fifth Clause</h2>
            <p>
              FUXION does not guarantee the availability or continuity of the site&apos;s
              operation. Accordingly, FUXION will under no circumstances be liable for any damage
              and/or harm that may arise from: (i) the unavailability or inaccessibility of the
              site; (ii) interruption of the site&apos;s operation or computer failures, telephone
              breakdowns, disconnections, delays, or blockages caused by deficiencies or overloads
              on telephone lines, data centers, the Internet system, or other electronic systems
              occurring during their operation; and (iii) other damages that may be caused by
              third parties through unauthorized intrusions beyond FUXION&apos;s control.
            </p>
            <p>
              FUXION does not guarantee the absence of viruses or other elements introduced by
              third parties unrelated to FUXION in the Application that could cause alterations to
              the Registered User&apos;s physical or logical systems or to electronic documents
              and files stored on their systems. Accordingly, FUXION will under no circumstances
              be liable for any damages of any kind arising from the presence of viruses or other
              elements that may cause alterations to the User&apos;s physical or logical systems,
              electronic documents, or files.
            </p>
            <p>
              FUXION adopts various protective measures to safeguard the Application and its
              contents against third-party cyberattacks. However, FUXION does not guarantee that
              unauthorized third parties will not become aware of the conditions, characteristics,
              and circumstances under which the Registered User accesses the Application.
              Accordingly, FUXION will under no circumstances be liable for damages arising from
              such unauthorized access.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Sixth Clause</h2>
            <p>
              The User acknowledges and accepts that all intellectual and industrial property
              rights over the content and/or any other elements included in the Application
              (including, without limitation, trademarks, logos, trade names, slogans, text,
              images, graphics, designs, sounds, databases, software, flowcharts, layout, audio
              and video, and/or any other intellectual or industrial property right of any nature)
              belong to and are the exclusive property of FUXION.
            </p>
            <p>
              FUXION authorizes the User to use, view, print, download, and store the content
              and/or elements included on the site exclusively for personal, private, non-commercial
              use, refraining from any act of decompilation, reverse engineering, modification,
              disclosure, or distribution thereof. Any other use or exploitation of any content
              and/or other elements included on the site, other than as expressly provided for
              herein, shall require FUXION&apos;s prior authorization.
            </p>
            <p>
              Under no circumstances shall access to the site and/or acceptance of the Terms and
              Conditions be understood to grant any right of assignment in favor of Users or any
              third party.
            </p>
            <p>
              FUXION is responsible for all content on the website, as well as for any changes it
              may make to it.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Seventh Clause</h2>
            <p>
              Personal data provided by Users for the purpose of making purchases on the site will
              be processed in accordance with Law No. 29733, the Personal Data Protection Law, and
              its Regulations, approved by Supreme Decree No. 003-2013-JUS, and other related
              regulations. Accordingly, FUXION undertakes to strictly comply with the aforementioned
              regulations, as well as to maintain the highest standards of security, protection,
              safekeeping, preservation, and confidentiality of the information received or sent.
            </p>
            <p>
              Users declare that their personal data has been provided freely and voluntarily,
              without any kind of pressure, obligation, or condition.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Eighth Clause</h2>
            <p>
              The User declares and accepts that FUXION may send timely notifications to the User
              via the site, text messages, or the email address provided by the User, including
              messages for promotional or advertising purposes. The Registered User may notify
              FUXION and request that promotional or advertising activity cease by submitting a
              request through the Support section available on the platform.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Ninth Clause</h2>
            <p>
              Photographic content of the products shown on the site is for reference only; there
              may be variations between the photo shown on the &ldquo;Compra Fuxion&rdquo; virtual
              store and the product received.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Tenth Clause</h2>
            <p>
              Any submission or complaint related to actions taken through this site must be
              submitted through our Customer Service channels, Monday through Friday from 9:00
              a.m. to 6:00 p.m. and Saturdays from 9:00 a.m. to 2:00 p.m., via WhatsApp chat at{" "}
              <a href="https://wa.me/51986867611" className={styles.link}>
                986 867 611
              </a>
              .
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Eleventh Clause</h2>
            <p>
              The prices of the products and services available on this site, while listed, are
              valid and applicable only on this site and are not necessarily applicable to other
              sales channels used by Fuxion, unless Fuxion states otherwise. Likewise, the company
              may modify any information contained on this site, including information related to
              merchandise, services, prices, stock, and conditions, at any time and without prior
              notice, respecting purchases that have been accepted up to that point.
            </p>
            <p>
              Promotions offered on this website are not necessarily the same as those offered
              through other sales channels used by Fuxion, such as physical stores, unless
              expressly stated on this site or in advertising carried out by the provider for each
              promotion.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Twelfth Clause</h2>
            <p>
              These Terms and Conditions, as well as the relationship between FUXION BIOTECH SAC
              and THE USER, shall be governed and interpreted in accordance with the laws in force
              in the Republic of Peru and the following documents:
            </p>
            <ul className={styles.list}>
              <li>The Terms and Conditions – FUXION BIOTECH S.A.C.</li>
              <li>
                The Privacy Policy of FUXION BIOTECH S.A.C. and Personal Data Processing.
              </li>
            </ul>
          </section>

          <p className={styles.footer}>FUXION BIOTECH S.A.C.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p className={styles.company}>FUXION BIOTECH S.A.C.</p>
        <h1 className={styles.title}>Términos y condiciones</h1>
        <p className={styles.subtitle}>
          Términos y Condiciones de la Tienda Online Q&apos;ocina en Casa
        </p>

        <section className={styles.section}>
          <p>
            El acceso y uso del servicio de compras por Internet de la tienda virtual
            &ldquo;Q&apos;ocina en Casa&rdquo; de FuXion Biotech S.A.C. (en adelante FUXION) están
            sujetos a la legislación peruana y se encuentra dirigido exclusivamente a residentes en
            la República de Perú. Los Usuarios se encontrarán sujetos a los Términos y Condiciones
            Generales de FUXION, junto con todas las demás políticas y principios que rigen a FUXION
            y que son incorporados por referencia; la relación contractual entre los usuarios (en
            adelante, &ldquo;Usuarios&rdquo;), con FUXION se rige por los siguientes términos y
            condiciones:
          </p>
          <p>
            La tienda virtual &ldquo;Q&apos;ocina en Casa&rdquo; de FUXION es una herramienta
            tecnológica que, haciendo uso de internet, facilita un canal digital de compra venta
            entre FUXION como VENDEDOR y las personas naturales que no están registradas como
            &ldquo;Emprendedores Fuxion&rdquo; o como &ldquo;Clientes&rdquo; en la base de datos de
            FUXION, quienes individualmente se constituyen como EL COMPRADOR o EL USUARIO.
          </p>
          <div className={styles.notice}>
            EL USUARIO, DECLARA HABER LEÍDO Y ENTENDIDO TODAS LAS CONDICIONES ESTABLECIDAS EN LAS
            POLÍTICAS DE PRIVACIDAD Y LOS PRESENTES TÉRMINOS Y CONDICIONES, Y MANIFIESTA SU
            CONFORMIDAD Y ACEPTACIÓN AL MOMENTO DE REGISTRARSE Y/O HACER USO DE LA TIENDA VIRTUAL
            &ldquo;COMPRA FUXION&rdquo;. CUALQUIER PERSONA QUE NO ACEPTE O SE ENCUENTRE EN
            DESACUERDO CON ESTOS TÉRMINOS Y CONDICIONES, LOS CUALES TIENEN UN CARÁCTER OBLIGATORIO Y
            VINCULANTE, DEBERÁ ABSTENERSE DE UTILIZAR LA TIENDA VIRTUAL &ldquo;COMPRA FUXION&rdquo;.
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Primera</h2>
          <p>
            El acceso al sitio es gratuito, salvo en lo relativo al costo de la conexión a través de
            la red de telecomunicaciones suministrada por el proveedor de acceso contratado (ISP) por
            el Usuario, que estará a su exclusivo cargo. El Usuario únicamente podrá acceder al sitio
            a través de los medios autorizados.
          </p>
          <p>
            Para el acceso a los contenidos de la TIENDA Q&apos;OCINA EN CASA no es necesario el
            registro como Usuario. Para perfeccionar la compra será necesario que EL COMPRADOR
            ingrese sus nombres y apellidos completos, número de documento de identidad, dirección de
            correo electrónico, número de teléfono de contacto y la dirección de envío adonde desea
            recibir la compra.
          </p>
          <p>
            FUXION podrá utilizar diversos medios para identificar a los Usuarios, pero no se
            responsabiliza por la certeza de los Datos Personales que los usuarios o compradores
            pongan a su disposición. Cada USUARIO o COMPRADOR garantiza y responde, en cualquier
            caso, por la veracidad, exactitud, vigencia y autenticidad de los Datos Personales
            puestos a disposición de FUXION.
          </p>
          <p>
            Los Datos Personales introducidos por el Usuario deberán ser exactos, actuales y veraces
            en todo momento. FUXION se reserva el derecho de solicitar algún comprobante y/o dato
            adicional a efectos de corroborar los Datos Personales, y de suspender temporal y/o
            definitivamente a aquel Usuario Registrado cuyos datos no hayan podido ser confirmados.
            FUXION NO se responsabiliza por la certeza de los datos consignados en el Registro.
          </p>
          <p>
            Nuestro sitio web ha sido desarrollado para garantizar la confidencialidad de la
            información proporcionada por nuestros clientes.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Segunda</h2>
          <p>
            La compra de los productos ofrecidos en el sitio podrá ser por los medios de pago
            disponibles: Pay U para pagos en línea y Safety Pay para banca por internet y pagos en
            efectivo. El procesamiento de pagos estará sujeto a todos los términos y condiciones y
            políticas de privacidad de cada Procesador de Pagos.
          </p>
          <p>
            En caso el banco no apruebe la transacción después de haberse efectuado o no tengamos la
            confirmación de este aun cuando la transacción se encuentre como exitosa, FUXION se
            encuentra facultado para anular la compra y, en ese caso, se realizará el extorno a la
            tarjeta de crédito o débito según sea el caso. Asimismo, FUXION se encuentra facultado
            para realizar una verificación de los datos de la persona que realizó la transacción a
            través de la tienda virtual &ldquo;COMPRA FUXION&rdquo; vía una llamada telefónica (al
            número de teléfono que se tiene registrado), lo cual se da por razones de seguridad o
            ante la sospecha de fraude, siendo que sólo sí se confirman los datos que corresponden,
            se procederá a aprobarse la venta; caso contrario no procederá la operación y se dará el
            extorno del monto de la compra a la tarjeta de débito o crédito del titular de la misma.
          </p>
          <p className={styles.important}>
            IMPORTANTE: FUXION no reservará o separará productos hasta que sean pagados.
          </p>
          <p>
            En caso de que realice el pago de algún producto que salió de stock, se le notificará y
            se le reembolsará el costo del producto.
          </p>
          <p>
            En el caso del pago mediante Safetypay o Pago efectivo, después de haber elegido esta
            alternativa, conserva el número de transacción y monto a pagar. Luego, ingresa a la
            página web de la institución financiera con la que realizarás el pago. Ingresa tu número
            de tarjeta y tu clave, selecciona la opción &ldquo;Pago de servicios&rdquo; y localiza
            el botón &laquo;Safetypay&raquo; o &ldquo;Pago Efectivo&rdquo;. Introduce el número de
            transacción y el monto a pagar. Para finalizar se te mandará la confirmación de tu
            compra.
          </p>
          <p>
            Los pagos realizados con tarjeta de crédito están sujetos a evaluación y verificación de
            datos. Para más detalle comunícate mediante el chat de whatsapp al número{" "}
            <a href="https://wa.me/51986867611" className={styles.link}>
              986 867 611
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Tercera</h2>
          <p>
            Las tarifas aplicables al Servicio de Reparto las fijará FUXION conforme a la ubicación
            geográfica y la demanda de entregas asociadas a la localidad de destino. Las tarifas por
            servicio de reparto serán incluidas en el monto total a pagar, incluyendo el Impuesto
            General a las Ventas. Las tarifas cobradas por el Servicio de Reparto no serán
            reembolsables.
          </p>
          <p>
            El destinatario del pedido debe contar con un número telefónico para coordinar la entrega
            (hora, lugar, persona que recibirá el pedido, identificación del receptor, etc.).
          </p>
          <p>
            Cualquiera sea la modalidad de pago, el encargado del reparto exigirá la identificación
            del receptor del pedido mediante su Documento Nacional de Identidad o carnet de
            extranjería según sea el caso, así como la firma de la guía de entrega. No se
            entregarán pedidos a menores de edad.
          </p>
          <p>
            La TIENDA Q&apos;OCINA EN CASA es el único responsable de la calidad de los productos,
            así como de la calidad del envío.
          </p>
          <p>
            Las opciones de entrega hacen referencia al horario de Lima, Perú. En caso de
            seleccionar un horario fuera de los plazos señalados, nuestra Asesora de Servicio se
            comunicará con el destinatario para indicar la disponibilidad de atención y coordinar la
            entrega del pedido.
          </p>
          <h3 className={styles.subheading}>
            Política de Cambios y Devoluciones, por compras en la TIENDA Q&apos;OCINA EN CASA
          </h3>
          <p>
            Si por alguna razón no te encuentras satisfecho con tu compra en la TIENDA Q&apos;OCINA
            EN CASA, puedes cambiar o devolver tu compra en sus condiciones originales dentro de los
            primeros 30 días hábiles de realizada la compra.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Cuarta</h2>
          <p>
            FUXION no será responsable si el Usuario no cuenta con un teléfono celular inteligente
            compatible con el uso del sitio. El Usuario Registrado se compromete a hacer un uso
            adecuado y lícito de la Aplicación de conformidad con la legislación aplicable, los
            presentes Términos y Condiciones, la moral y buenas costumbres generalmente aceptadas y
            el orden público. Al utilizar el sitio el Usuario acuerda que:
          </p>
          <ul className={styles.list}>
            <li>
              No tratará de dañar el sitio de ningún modo, ni accederá a recursos restringidos en el
              sitio.
            </li>
            <li>No utilizará el sitio con un dispositivo incompatible o no autorizado.</li>
            <li>
              No intentará acceder, utilizar y/o manipular los datos de FUXION y otros Usuarios.
            </li>
            <li>
              No introducirá ni difundirá virus informáticos o cualesquiera otros sistemas físicos o
              lógicos que sean susceptibles de provocar daños en el sitio.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Quinta</h2>
          <p>
            FUXION no garantiza la disponibilidad y continuidad del funcionamiento del sitio. En
            consecuencia, FUXION no será en ningún caso responsable por cualquier daño y/o perjuicio
            que puedan derivarse de: (i) la falta de disponibilidad o accesibilidad al sitio; (ii)
            la interrupción en el funcionamiento del sitio o fallos informáticos, averías
            telefónicas, desconexiones, retrasos o bloqueos causados por deficiencias o sobrecargas
            en las líneas telefónicas, centros de datos, en el sistema de Internet o en otros
            sistemas electrónicos, producidos en el curso de su funcionamiento; y, (iii) otros daños
            que puedan ser causados por terceros mediante intromisiones no autorizadas ajenas al
            control de FUXION.
          </p>
          <p>
            FUXION no garantiza la ausencia de virus ni de otros elementos en la Aplicación
            introducidos por terceros ajenos a FUXION que puedan producir alteraciones en los
            sistemas físicos o lógicos del Usuario Registrado o en los documentos electrónicos y
            ficheros almacenados en sus sistemas. En consecuencia, FUXION no será en ningún caso
            responsable de cualesquiera de los daños y perjuicios de cualquier naturaleza que
            pudieran derivarse de la presencia de virus u otros elementos que puedan producir
            alteraciones en los sistemas físicos o lógicos, documentos electrónicos o ficheros del
            Usuario.
          </p>
          <p>
            FUXION adopta diversas medidas de protección para proteger la Aplicación y los contenidos
            contra ataques informáticos de terceros. No obstante, FUXION no garantiza que terceros no
            autorizados no puedan conocer las condiciones, características y circunstancias en las
            cuales el Usuario Registrado accede a la Aplicación. En consecuencia, FUXION no será en
            ningún caso responsable de los daños y perjuicios que pudieran derivarse de dicho acceso
            no autorizado.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Sexta</h2>
          <p>
            El Usuario reconoce y acepta que todos los derechos de propiedad intelectual e industrial
            sobre los contenidos y/o cualesquiera otros elementos insertados en la Aplicación
            (incluyendo, sin limitación, marcas, logotipos, nombres comerciales, lemas comerciales,
            textos, imágenes, gráficos, diseños, sonidos, bases de datos, software, diagramas de
            flujo, presentación, audio y vídeo y/o cualquier otro derecho de propiedad intelectual e
            industrial de cualquier naturaleza), pertenecen y son de propiedad exclusiva de FUXION.
          </p>
          <p>
            FUXION autoriza al Usuario a utilizar, visualizar, imprimir, descargar y almacenar los
            contenidos y/o los elementos insertados en el sitio exclusivamente para su uso personal,
            privado y no lucrativo, absteniéndose de realizar sobre los mismos cualquier acto de
            descompilación, ingeniería inversa, modificación, divulgación o suministro. Cualquier
            otro uso o explotación de cualesquiera contenidos y/u otros elementos insertados en el
            sitio distinto de los aquí expresamente previstos estará sujeto a la autorización previa
            de FUXION.
          </p>
          <p>
            Bajo ningún concepto se entenderá que el acceso al sitio y/o la aceptación de los
            Términos y Condiciones genera algún derecho de cesión a favor de los Usuarios ni de
            cualquier tercero.
          </p>
          <p>
            FUXION es responsable de todo contenido de la página web, así como de cualquier cambio
            que pueda llevar a cabo en la misma.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Séptima</h2>
          <p>
            Los datos personales que los Usuarios proporcionen para efectos de realizar compras en
            el sitio serán tratados según lo dispone la Ley N° 29733, Ley de Protección de Datos
            Personales y su Reglamento, aprobado mediante Decreto Supremo N° 003-2013-JUS y demás
            normas conexas. En ese sentido, FUXION se obliga al cumplimiento estricto de las normas
            anteriormente mencionadas, así como a mantener los estándares máximos de seguridad,
            protección, resguardo, conservación y confidencialidad de la información recibida o
            enviada.
          </p>
          <p>
            Los Usuarios declaran que los datos personales han sido entregados de forma absolutamente
            libre y voluntaria, sin ningún tipo de presión, obligación o condición de por medio.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Octava</h2>
          <p>
            El Usuario declara y acepta que FUXION podrá realizar las notificaciones oportunas al
            Usuario del sitio, mensajes de texto, o la dirección de correo electrónico facilitada
            por el Usuario, incluyendo el envío de mensajes con fines promocionales o publicitarios.
            El Usuario Registrado podrá notificar a FUXION y solicitar el cese de la actividad
            promocional o publicitaria mediante una solicitud a través de la sección de Soporte
            disponible en la plataforma virtual.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Novena</h2>
          <p>
            El contenido fotográfico de los productos que aparecen en el sitio son referenciales,
            pueden existir variantes entre la foto mostrada en la tienda virtual
            &ldquo;Compra Fuxion&rdquo; y el producto recibido.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Décima</h2>
          <p>
            Toda presentación o reclamo relacionado con actos a través de este sitio, deberá ser
            presentado mediante nuestros canales de Servicio al cliente de lunes a viernes desde las
            09:00 a 18:00 horas y los sábados de 9:00 a 14:00 horas, mediante el chat de whatsapp
            al número{" "}
            <a href="https://wa.me/51986867611" className={styles.link}>
              986 867 611
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Onceava</h2>
          <p>
            Los precios de los productos y servicios disponibles en este sitio, mientras aparezcan
            en él, sólo tendrán vigencia y aplicación en éste y no serán necesariamente aplicables
            a otros canales de venta utilizados por Fuxion, salvo que Fuxion lo indique. Asimismo,
            la empresa podrá modificar cualquier información contenida en este sitio, incluyendo las
            relacionadas con mercaderías, servicios, precios, existencias y condiciones, en cualquier
            momento y sin previo aviso, respetando las compras que han sido aceptadas hasta dicho
            momento.
          </p>
          <p>
            Las promociones que se ofrezcan en este sitio web no son necesariamente las mismas que
            ofrezcan otros canales de venta utilizados por Fuxion, tales como locales físicos, a
            menos que se señale expresamente en este sitio o en la publicidad que realice la empresa
            proveedora para cada promoción.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Cláusula Doceava</h2>
          <p>
            Las presentes Términos y Condiciones, así como la relación entre FUXION BIOTECH SAC y EL
            USUARIO, se regirán e interpretarán con arreglo a la legislación vigente en la República
            del Perú y los siguientes documentos:
          </p>
          <ul className={styles.list}>
            <li>Los Términos y Condiciones – FUXION BIOTECH S.A.C.</li>
            <li>
              Las Política de Privacidad de FUXION BIOTECH S.A.C. y Tratamiento de Datos Personales.
            </li>
          </ul>
        </section>

        <p className={styles.footer}>FUXION BIOTECH S.A.C.</p>
      </div>
    </div>
  );
}
