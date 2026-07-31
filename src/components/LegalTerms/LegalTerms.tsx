import styles from "./LegalTerms.module.css";

type LegalSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
  listAfterParagraphIndex?: number;
  listGroups?: Array<{
    afterParagraphIndex: number;
    items: string[];
  }>;
};

type LegalTermsCopy = {
  company: string;
  title: string;
  subtitle: string;
  footer: string;
  sections: LegalSection[];
};

const copy: Record<"es" | "en", LegalTermsCopy> = {
  es: {
    company: "FUXION BIOTECH S.A.C.",
    title: "Términos y condiciones",
    subtitle: "Términos y condiciones de la tienda virtual Q'ocina en Casa",
    footer: "FUXION BIOTECH S.A.C.",
    sections: [
  {
    title: "1. Identificación del proveedor",
    paragraphs: [
      "La presente plataforma de comercio electrónico denominada \"Q'ocina en Casa\" (en adelante, la \"Plataforma\") es operada por FUXION BIOTECH S.A.C., persona jurídica constituida conforme a la legislación peruana, identificada con RUC N.° 20513081236, con domicilio en Av. El Derby N° 210-A, distrito de Santiago de Surco, Lima - Perú, correo electrónico de atención al cliente [●] y teléfono [●] (en adelante, \"FUXION\").",
      "El acceso y uso de la Plataforma implica la aceptación plena y sin reservas de los presentes Términos y Condiciones.",
    ],
  },
  {
    title: "2. Objeto",
    paragraphs: [
      "La Plataforma constituye un canal digital mediante el cual FUXION comercializa productos a consumidores finales ubicados en el territorio peruano.",
      "Las transacciones efectuadas a través de la Plataforma se encuentran sujetas a la legislación peruana vigente y a los presentes Términos y Condiciones.",
    ],
  },
  {
    title: "3. Capacidad para contratar",
    paragraphs: [
      "Podrán realizar compras únicamente las personas mayores de dieciocho (18) años con capacidad legal para contratar.",
      "El Usuario declara que toda la información proporcionada durante el proceso de compra es verdadera, exacta, completa y actualizada.",
      "FUXION podrá solicitar información adicional para verificar la identidad del Usuario cuando resulte razonablemente necesario para prevenir fraudes o actividades ilícitas.",
    ],
  },
  {
    title: "4. Registro y datos del Usuario",
    paragraphs: ["Para efectuar una compra, el Usuario deberá proporcionar como mínimo:", "El Usuario será responsable de la exactitud de la información proporcionada.", "FUXION podrá suspender o cancelar pedidos cuando detecte inconsistencias, información falsa o indicios razonables de fraude."],
    listAfterParagraphIndex: 0,
    list: ["Nombres y apellidos completos.", "Documento de identidad.", "Correo electrónico.", "Número de teléfono.", "Dirección de entrega."],
  },
  {
    title: "5. Productos y disponibilidad",
    paragraphs: [
      "Todos los productos están sujetos a disponibilidad de stock.",
      "La incorporación de un producto en la Plataforma no garantiza su disponibilidad permanente.",
      "En caso un producto no se encuentre disponible luego de confirmada una orden, FUXION comunicará dicha situación al Usuario y procederá al reembolso correspondiente dentro del plazo máximo de quince (15) días hábiles, utilizando el mismo medio de pago empleado para la compra cuando ello sea técnicamente posible.",
    ],
  },
  {
    title: "6. Precios",
    paragraphs: [
      "Todos los precios publicados incluyen el Impuesto General a las Ventas (IGV) y se encuentran expresados en Soles (S/), salvo indicación expresa en contrario.",
      "FUXION podrá modificar precios, promociones y condiciones comerciales en cualquier momento; sin embargo, dichas modificaciones no afectarán las compras válidamente realizadas y confirmadas con anterioridad.",
    ],
  },
  {
    title: "7. Medios de pago",
    paragraphs: ["Las compras podrán realizarse mediante los medios de pago habilitados en la Plataforma.", "Toda transacción estará sujeta a los procedimientos de validación y autorización efectuados por las entidades financieras, pasarelas de pago o procesadores correspondientes.", "FUXION podrá rechazar o cancelar una operación cuando:", "En tales casos se gestionará el reembolso respectivo."],
    listAfterParagraphIndex: 2,
    list: ["No exista autorización de la entidad financiera.", "Se detecten inconsistencias en la información proporcionada.", "Existan indicios razonables de fraude.", "No se pueda verificar la identidad del comprador."],
  },
  {
    title: "8. Entrega de productos",
    paragraphs: [
      "La entrega se realizará en la dirección indicada por el Usuario dentro de las zonas de cobertura habilitadas por FUXION.",
      "El Usuario deberá garantizar que una persona mayor de edad se encuentre disponible para recibir el pedido.",
      "El receptor podrá ser requerido para acreditar su identidad mediante DNI, Carné de Extranjería u otro documento válido.",
      "Los plazos de entrega son referenciales y podrán variar por causas operativas, climáticas, de fuerza mayor o situaciones ajenas al control razonable de FUXION.",
    ],
  },
  {
    title: "9. Cambios, devoluciones y reembolsos",
    paragraphs: ["El Usuario podrá solicitar el cambio o devolución de los productos dentro de los treinta (30) días calendario posteriores a la recepción del pedido, siempre que:", "No procederán cambios o devoluciones respecto de:", "Una vez aprobada la devolución, FUXION gestionará el reembolso correspondiente dentro de los quince (15) días hábiles siguientes a la validación de la solicitud."],
    listGroups: [
      { afterParagraphIndex: 0, items: ["El producto se encuentre sin uso.", "Mantenga su empaque original.", "Conserve sellos, etiquetas y accesorios.", "Se presente el comprobante de compra."] },
      { afterParagraphIndex: 1, items: ["Productos consumidos parcial o totalmente.", "Productos deteriorados por causas atribuibles al consumidor.", "Productos cuya naturaleza impida su devolución por razones sanitarias o de seguridad alimentaria."] },
    ],
  },
  {
    title: "10. Propiedad intelectual",
    paragraphs: [
      "Todos los contenidos de la Plataforma, incluyendo textos, imágenes, logotipos, diseños, software, marcas, nombres comerciales y demás elementos, son propiedad exclusiva de FUXION o de terceros que hayan autorizado su uso.",
      "Queda prohibida su reproducción, distribución, modificación o explotación sin autorización previa y por escrito.",
    ],
  },
  {
    title: "11. Uso adecuado de la Plataforma",
    paragraphs: ["El Usuario se obliga a:", "El incumplimiento de estas obligaciones facultará a FUXION a restringir o bloquear el acceso del Usuario."],
    listAfterParagraphIndex: 0,
    list: ["No realizar actividades ilícitas.", "No introducir malware, virus o código malicioso.", "No acceder sin autorización a sistemas o información de FUXION.", "No afectar el normal funcionamiento de la Plataforma."],
  },
  {
    title: "12. Limitación de responsabilidad",
    paragraphs: ["FUXION realiza esfuerzos razonables para mantener la disponibilidad y seguridad de la Plataforma.", "No obstante, no garantiza que ésta opere de forma ininterrumpida o libre de errores.", "FUXION no será responsable por daños derivados de:", "Lo anterior no limita ni excluye la responsabilidad que corresponda a FUXION conforme a la legislación peruana aplicable en materia de protección al consumidor."],
    listAfterParagraphIndex: 2,
    list: ["Fallas de internet.", "Problemas de conectividad del Usuario.", "Ataques informáticos de terceros.", "Casos fortuitos o fuerza mayor."],
  },
  {
    title: "13. Protección de datos personales",
    paragraphs: ["Los datos personales proporcionados por los Usuarios serán tratados conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, y su normativa complementaria.", "Los datos serán utilizados para:", "Los Usuarios podrán ejercer sus derechos de acceso, rectificación, cancelación y oposición (ARCO) mediante comunicación dirigida a [correo de privacidad]."],
    listAfterParagraphIndex: 1,
    list: ["Gestionar compras y entregas.", "Procesar pagos.", "Atender consultas y reclamos.", "Cumplir obligaciones legales y regulatorias.", "Realizar acciones comerciales cuando exista consentimiento del titular."],
  },
  {
    title: "14. Comunicaciones comerciales",
    paragraphs: [
      "El Usuario podrá autorizar de forma libre, previa, expresa e informada el envío de publicidad, promociones y comunicaciones comerciales.",
      "La revocación de dicho consentimiento podrá efectuarse en cualquier momento mediante los mecanismos habilitados por FUXION.",
    ],
  },
  {
    title: "15. Atención al cliente",
    paragraphs: ["Las consultas, solicitudes, incidencias, quejas y reclamos relacionados con pedidos, entregas, cambios, devoluciones o cualquier aspecto del servicio podrán gestionarse a través de los canales de atención al cliente habilitados por FUXION, tales como correo electrónico, WhatsApp o los formularios de contacto disponibles en la Plataforma.", "Las consultas, reclamos o solicitudes podrán presentarse mediante:"],
    listAfterParagraphIndex: 1,
    list: ["WhatsApp: [●]", "Correo electrónico: [●]", "Portal web: [●]", "Horario de atención: [●]."],
  },
  {
    title: "16. Libro de reclamaciones",
    paragraphs: [
      "FUXION pone a disposición de los consumidores un Libro de Reclamaciones Virtual conforme a la Ley N.° 29571 - Código de Protección y Defensa del Consumidor y la normativa aplicable.",
      "Los usuarios podrán presentar quejas o reclamos a través del Libro de Reclamaciones disponible en el sitio web oficial de FUXION, accesible mediante el enlace correspondiente publicado en la Plataforma.",
      "Los reclamos serán atendidos dentro de los plazos previstos por la normativa vigente.",
    ],
  },
  {
    title: "17. Modificación de los términos y condiciones",
    paragraphs: [
      "FUXION podrá modificar los presentes Términos y Condiciones en cualquier momento.",
      "Las modificaciones entrarán en vigencia desde su publicación en la Plataforma y no afectarán operaciones previamente confirmadas.",
    ],
  },
  {
    title: "18. Ley aplicable y jurisdicción",
    paragraphs: [
      "Los presentes Términos y Condiciones se rigen por las leyes de la República del Perú.",
      "Cualquier controversia derivada de su interpretación o ejecución será resuelta conforme a la legislación peruana vigente, sin perjuicio de los derechos reconocidos a los consumidores por la normativa de protección al consumidor.",
    ],
  },
    ],
  },
  en: {
    company: "FUXION BIOTECH S.A.C.",
    title: "Terms and conditions",
    subtitle: "Terms and conditions of the Q'ocina en Casa virtual store",
    footer: "FUXION BIOTECH S.A.C.",
    sections: [
      {
        title: "1. Supplier identification",
        paragraphs: [
          "This e-commerce platform named \"Q'ocina en Casa\" (hereinafter, the \"Platform\") is operated by FUXION BIOTECH S.A.C., a legal entity incorporated under Peruvian law, identified with RUC No. 20513081236, domiciled at Av. El Derby N° 210-A, district of Santiago de Surco, Lima - Peru, customer service email [●] and phone [●] (hereinafter, \"FUXION\").",
          "Access to and use of the Platform implies full and unconditional acceptance of these Terms and Conditions.",
        ],
      },
      {
        title: "2. Purpose",
        paragraphs: [
          "The Platform is a digital channel through which FUXION sells products to end consumers located in Peruvian territory.",
          "Transactions made through the Platform are subject to current Peruvian law and these Terms and Conditions.",
        ],
      },
      {
        title: "3. Capacity to contract",
        paragraphs: [
          "Only persons over eighteen (18) years of age with legal capacity to contract may make purchases.",
          "The User declares that all information provided during the purchase process is true, accurate, complete, and up to date.",
          "FUXION may request additional information to verify the User's identity when reasonably necessary to prevent fraud or unlawful activities.",
        ],
      },
      {
        title: "4. User registration and data",
        paragraphs: [
          "To make a purchase, the User must provide at least:",
          "The User is responsible for the accuracy of the information provided.",
          "FUXION may suspend or cancel orders when it detects inconsistencies, false information, or reasonable signs of fraud.",
        ],
        listAfterParagraphIndex: 0,
        list: [
          "Full first and last names.",
          "Identity document.",
          "Email address.",
          "Phone number.",
          "Delivery address.",
        ],
      },
      {
        title: "5. Products and availability",
        paragraphs: [
          "All products are subject to stock availability.",
          "The inclusion of a product on the Platform does not guarantee its permanent availability.",
          "If a product is unavailable after an order has been confirmed, FUXION will inform the User and process the corresponding refund within a maximum period of fifteen (15) business days, using the same payment method used for the purchase when technically possible.",
        ],
      },
      {
        title: "6. Prices",
        paragraphs: [
          "All published prices include General Sales Tax (IGV) and are expressed in Soles (S/), unless expressly stated otherwise.",
          "FUXION may change prices, promotions, and commercial conditions at any time; however, such changes will not affect purchases validly made and confirmed beforehand.",
        ],
      },
      {
        title: "7. Payment methods",
        paragraphs: [
          "Purchases may be made through the payment methods enabled on the Platform.",
          "Every transaction will be subject to the validation and authorization procedures carried out by the relevant financial institutions, payment gateways, or processors.",
          "FUXION may reject or cancel a transaction when:",
          "In such cases, the corresponding refund will be processed.",
        ],
        listAfterParagraphIndex: 2,
        list: [
          "There is no authorization from the financial institution.",
          "Inconsistencies are detected in the information provided.",
          "There are reasonable signs of fraud.",
          "The buyer's identity cannot be verified.",
        ],
      },
      {
        title: "8. Product delivery",
        paragraphs: [
          "Delivery will be made to the address indicated by the User within the coverage areas enabled by FUXION.",
          "The User must ensure that an adult is available to receive the order.",
          "The recipient may be required to prove their identity with a DNI, foreign resident card, or another valid document.",
          "Delivery times are referential and may vary due to operational or weather-related causes, force majeure, or situations beyond FUXION's reasonable control.",
        ],
      },
      {
        title: "9. Exchanges, returns, and refunds",
        paragraphs: [
          "The User may request an exchange or return of products within thirty (30) calendar days after receiving the order, provided that:",
          "Exchanges or returns will not apply to:",
          "Once the return is approved, FUXION will process the corresponding refund within fifteen (15) business days after validation of the request.",
        ],
        listGroups: [
          {
            afterParagraphIndex: 0,
            items: [
              "The product is unused.",
              "It keeps its original packaging.",
              "It keeps seals, labels, and accessories.",
              "The purchase receipt is provided.",
            ],
          },
          {
            afterParagraphIndex: 1,
            items: [
              "Products partially or fully consumed.",
              "Products damaged due to causes attributable to the consumer.",
              "Products whose nature prevents return for sanitary or food safety reasons.",
            ],
          },
        ],
      },
      {
        title: "10. Intellectual property",
        paragraphs: [
          "All Platform content, including texts, images, logos, designs, software, trademarks, trade names, and other elements, is the exclusive property of FUXION or of third parties that have authorized its use.",
          "Its reproduction, distribution, modification, or exploitation without prior written authorization is prohibited.",
        ],
      },
      {
        title: "11. Proper use of the Platform",
        paragraphs: [
          "The User agrees to:",
          "Failure to comply with these obligations will entitle FUXION to restrict or block the User's access.",
        ],
        listAfterParagraphIndex: 0,
        list: [
          "Not carry out unlawful activities.",
          "Not introduce malware, viruses, or malicious code.",
          "Not access FUXION systems or information without authorization.",
          "Not affect the normal operation of the Platform.",
        ],
      },
      {
        title: "12. Limitation of liability",
        paragraphs: [
          "FUXION makes reasonable efforts to maintain the availability and security of the Platform.",
          "However, it does not guarantee that the Platform will operate uninterrupted or error-free.",
          "FUXION will not be liable for damages arising from:",
          "The foregoing does not limit or exclude any liability that may correspond to FUXION under applicable Peruvian consumer protection law.",
        ],
        listAfterParagraphIndex: 2,
        list: [
          "Internet failures.",
          "Connectivity problems of the User.",
          "Cyberattacks by third parties.",
          "Acts of God or force majeure.",
        ],
      },
      {
        title: "13. Personal data protection",
        paragraphs: [
          "Personal data provided by Users will be processed in accordance with Law No. 29733, Personal Data Protection Law, and its supplementary regulations.",
          "The data will be used to:",
          "Users may exercise their rights of access, rectification, cancellation, and opposition (ARCO) by sending a communication to [privacy email].",
        ],
        listAfterParagraphIndex: 1,
        list: [
          "Manage purchases and deliveries.",
          "Process payments.",
          "Respond to inquiries and claims.",
          "Comply with legal and regulatory obligations.",
          "Carry out commercial actions when the data subject has given consent.",
        ],
      },
      {
        title: "14. Commercial communications",
        paragraphs: [
          "The User may freely, previously, expressly, and informedly authorize the sending of advertising, promotions, and commercial communications.",
          "Such consent may be revoked at any time through the mechanisms enabled by FUXION.",
        ],
      },
      {
        title: "15. Customer service",
        paragraphs: [
          "Inquiries, requests, incidents, complaints, and claims related to orders, deliveries, exchanges, returns, or any aspect of the service may be managed through the customer service channels enabled by FUXION, such as email, WhatsApp, or the contact forms available on the Platform.",
          "Inquiries, claims, or requests may be submitted through:",
        ],
        listAfterParagraphIndex: 1,
        list: ["WhatsApp: [●]", "Email: [●]", "Website: [●]", "Service hours: [●]."],
      },
      {
        title: "16. Complaints book",
        paragraphs: [
          "FUXION makes a Virtual Complaints Book available to consumers in accordance with Law No. 29571 - Consumer Protection and Defense Code and applicable regulations.",
          "Users may submit complaints or claims through the Complaints Book available on FUXION's official website, accessible through the corresponding link published on the Platform.",
          "Claims will be addressed within the periods established by current regulations.",
        ],
      },
      {
        title: "17. Changes to the terms and conditions",
        paragraphs: [
          "FUXION may modify these Terms and Conditions at any time.",
          "Changes will take effect upon publication on the Platform and will not affect previously confirmed transactions.",
        ],
      },
      {
        title: "18. Applicable law and jurisdiction",
        paragraphs: [
          "These Terms and Conditions are governed by the laws of the Republic of Peru.",
          "Any dispute arising from their interpretation or execution will be resolved in accordance with current Peruvian law, without prejudice to the rights recognized to consumers by consumer protection regulations.",
        ],
      },
    ],
  },
};

type LegalTermsProps = {
  locale?: string;
};

export default function LegalTerms({ locale = "es" }: LegalTermsProps) {
  const t = locale === "en" ? copy.en : copy.es;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p className={styles.company}>{t.company}</p>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        {t.sections.map((section) => (
          <section className={styles.section} key={section.title}>
            <h2 className={styles.heading}>{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <div key={paragraph}>
                <p>{paragraph}</p>
                {section.list && section.listAfterParagraphIndex === index && (
                  <ul className={styles.list}>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.listGroups
                  ?.filter((list) => list.afterParagraphIndex === index)
                  .map((list) => (
                    <ul className={styles.list} key={list.items.join("|")}>
                      {list.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ))}
              </div>
            ))}
          </section>
        ))}

        <p className={styles.footer}>{t.footer}</p>
      </div>
    </div>
  );
}
