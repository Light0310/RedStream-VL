import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Shield, Zap, Tv, Play, Activity, Smartphone } from 'lucide-react';
import { Language } from '../types';

interface FAQItem {
  question: string;
  answer: string;
}

const faqTranslations: Record<Language, { title: string; subtitle: string; items: FAQItem[] }> = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about setting up and streaming with RedStream IPTV.",
    items: [
      {
        question: "What makes RedStream the best premium IPTV subscription on the market?",
        answer: "Choosing the best premium IPTV subscription is crucial for an optimal home entertainment experience. RedStream stands out as the ultimate choice because we leverage cutting-edge Anti-Freeze server technology paired with state-of-the-art server infrastructure. We do not host cheap, overloaded public streams; instead, we invest heavily in private, high-bandwidth server clusters with dedicated load balancers. This architectural setup guarantees 99.9% uptime and a completely seamless, stutter-free viewing experience. If you are tired of frequent disconnects and low-resolution video, our premium subscription offers crystal-clear 4K streaming and live sports with ultra-low latency, ensuring you never miss a goal or an action-packed movie scene."
      },
      {
        question: "Which applications do you support, and how do I perform an IPTV Smarters Pro setup or IBO Player activation?",
        answer: "We pride ourselves on offering universal compatibility across a massive ecosystem of streaming applications. For clients who prefer a simple, feature-rich interface, we provide full support and comprehensive guides for IPTV Smarters Pro setup. Our tech team will walk you through entering your credentials (M3U playlist link or Xtream Codes API parameters) step-by-step. Furthermore, we specialize in high-performance applications; our support agents can assist with instant IBO Player activation or setup on TiviMate, Smart IPTV, and Duplex Play. Once you purchase your subscription, we deliver your credentials via WhatsApp instantly, and our technical engineers remain available 24/7 to ensure your preferred application is fully optimized and ready."
      },
      {
        question: "Is RedStream considered the best IPTV for Smart TV platforms?",
        answer: "Absolutely! RedStream is widely recognized as the best IPTV for Smart TV systems, specifically optimized for Samsung Smart TV (Tizen OS), LG Smart TV (WebOS), and Android-based Smart TVs (including Sony, Philips, and Hisense). While other providers struggle with native Smart TV operating systems, our streaming playlists are compressed and structured using advanced codecs that native TV players can decode effortlessly. This results in ultra-fast channel zapping speeds (under 1 second) and smooth navigation. In addition, our service is fully optimized for Amazon Firestick (Fire OS), Android TV Boxes (Xiaomi Mi Box, Nvidia Shield), Apple TV (tvOS), and MAG devices, providing a unified and incredibly sleek entertainment hub."
      },
      {
        question: "Will I experience freezing or buffering during live sports broadcasts?",
        answer: "No! We guarantee a zero buffering experience, specifically engineered for high-traffic live events. Traditional IPTV services buffer constantly during major events because their servers are overwhelmed by sudden spikes in traffic. RedStream solves this issue by deploying our custom-built Anti-Freeze server technology with proactive capacity scaling. We actively monitor server load and route traffic dynamically. Whether you are watching the Champions League, Super Bowl, Formula 1, or pay-per-view boxing, you will enjoy flawless 4K streaming and live sports in real-time, exactly as if you were watching cable TV, but with superior image definition."
      },
      {
        question: "How fast is the setup and activation process?",
        answer: "Setup is virtually instant! We understand that when you buy a premium service, you want to start watching immediately. Once your secure payment is confirmed, our automated system generates your credentials and sends them directly to our dedicated WhatsApp support team. From there, a real human agent will deliver your custom M3U playlist and Xtream Codes login within 10 to 15 minutes. We will then guide you through the setup on your specific device—whether you need help with IPTV Smarters Pro setup, an IBO Player activation code, or configuring your Smart TV application. We stay with you on the chat until your first channel is successfully playing in 4K."
      },
      {
        question: "Can I use my subscription on multiple devices simultaneously?",
        answer: "Your RedStream subscription can be installed on as many devices as you like, including your Smart TV, smartphone, tablet, computer, and Firestick. However, to maintain server stability and prevent stream degradation, our standard plan supports one active stream at a time. This ensures that you get the maximum possible bandwidth of our premium servers with zero buffering. If you need to watch different channels on multiple devices at the same exact time, please contact our support team on WhatsApp, and we will happily offer you a heavily discounted multi-room package designed to accommodate your entire household's streaming needs."
      }
    ]
  },
  fr: {
    title: "Foire Aux Questions",
    subtitle: "Tout ce que vous devez savoir sur la configuration et la diffusion avec RedStream IPTV.",
    items: [
      {
        question: "Qu'est-ce qui fait de RedStream le meilleur abonnement IPTV premium du marché ?",
        answer: "Choisir le best premium IPTV subscription (meilleur abonnement IPTV premium) est essentiel pour une expérience de divertissement à domicile optimale. RedStream se distingue comme le choix ultime grâce à notre Anti-Freeze server technology (technologie de serveur anti-coupure) de pointe, combinée à une infrastructure de serveurs ultra-moderne. Nous n'hébergeons pas de flux publics surchargés ; nous investissons massivement dans des serveurs privés à large bande passante avec répartiteurs de charge dédiés. Cela garantit une disponibilité de 99,9 % pour une diffusion fluide sans interruptions ni ralentissements. Profitez pleinement de notre service pour le 4K streaming and live sports (streaming 4K et sports en direct) avec une clarté exceptionnelle et une latence ultra-faible."
      },
      {
        question: "Quelles applications supportez-vous et comment faire l'installation de Smarters Pro ou IBO Player ?",
        answer: "Nous offrons une compatibilité universelle avec les meilleures applications de streaming. Pour les utilisateurs qui préfèrent une interface simple, nous fournissons un guide complet pour l'IPTV Smarters Pro setup (configuration d'IPTV Smarters Pro). Nous vous guidons pas à pas pour saisir vos accès M3U ou Xtream Codes. De plus, nos agents vous aident pour l'IBO Player activation instantanée ainsi que pour la configuration sur TiviMate, Smart IPTV et Duplex Play. Après l'achat, vos identifiants sont envoyés instantanément via WhatsApp, et nos ingénieurs restent disponibles 24h/24 et 7j/7 pour assurer une mise en œuvre parfaite."
      },
      {
        question: "RedStream est-il considéré comme le meilleur IPTV pour Smart TV ?",
        answer: "Absolument ! RedStream est reconnu comme le best IPTV for Smart TV (meilleur IPTV pour Smart TV), spécialement optimisé pour les téléviseurs Samsung (Tizen OS), LG (webOS) et Android TV (Sony, Philips, Hisense). Nos flux utilisent des codecs avancés que les lecteurs natifs décodent sans effort, offrant un zapping ultra-rapide (moins d'une seconde) et une navigation fluide. Notre abonnement est également idéal pour Amazon Firestick (Fire OS), Apple TV (tvOS) et les boîtiers Android, formant un centre multimédia élégant."
      },
      {
        question: "Vais-je rencontrer des ralentissements ou du buffering pendant les matchs en direct ?",
        answer: "Non ! Nous garantissons une expérience avec zero buffering (zéro mise en mémoire tampon), conçue spécialement pour les événements sportifs à forte audience. Grâce à notre Anti-Freeze server technology et une gestion proactive de la bande passante, les flux restent stables même lors des pics de trafic sur les grands événements mondiaux. Que vous regardiez la Ligue des Champions, la Formule 1, la Liga ou des combats de MMA, vous bénéficierez d'une diffusion fluide en 4K streaming and live sports en temps réel."
      },
      {
        question: "Combien de temps prend la configuration et l'activation de ma ligne ?",
        answer: "L'activation est quasi-instantanée ! Dès que votre paiement sécurisé est validé, notre système génère vos accès et les envoie à notre équipe WhatsApp. Vous recevez vos identifiants sous 10 à 15 minutes. Nous vous accompagnons ensuite pour l'IPTV Smarters Pro setup ou l'IBO Player activation étape par étape jusqu'à ce que votre flux fonctionne parfaitement en 4K."
      },
      {
        question: "Puis-je utiliser mon abonnement sur plusieurs écrans ou appareils en même temps ?",
        answer: "Votre abonnement peut être configuré sur tous vos appareils (Smart TV, smartphone, tablette, PC, Firestick). Cependant, pour garantir une bande passante optimale et un flux avec zero buffering, notre offre standard autorise une seule connexion active à la fois. Pour connecter plusieurs écrans en même temps sans perte de qualité, contactez notre support WhatsApp pour bénéficier d'une offre multi-écrans à tarif très réduit."
      }
    ]
  },
  es: {
    title: "Preguntas Frecuentes",
    subtitle: "Todo lo que necesita saber sobre la configuración y transmisión con RedStream IPTV.",
    items: [
      {
        question: "¿Qué hace que RedStream sea la mejor suscripción IPTV premium del mercado?",
        answer: "Elegir la best premium IPTV subscription (mejor suscripción IPTV premium) es clave para disfrutar del mejor entretenimiento. RedStream destaca como la opción definitiva porque implementamos nuestra Anti-Freeze server technology (tecnología de servidor anticongelación) de última generación, combinada con una infraestructura robusta de servidores privados de alto ancho de banda. Esto garantiza un tiempo de actividad del 99.9% y una experiencia fluida, sin cortes. Si busca deshacerse de los molestos bloqueos, nuestro servicio ofrece 4K streaming and live sports (transmisión 4K y deportes en directo) con una latencia extremadamente baja y máxima nitidez."
      },
      {
        question: "¿Qué aplicaciones soportan y cómo configuro IPTV Smarters Pro o activo IBO Player?",
        answer: "Nos enorgullecemos de ofrecer compatibilidad universal con las mejores aplicaciones. Ofrecemos soporte completo y guías detalladas para IPTV Smarters Pro setup, guiándole paso a paso para configurar su lista M3U o Xtream Codes. También nos especializamos en aplicaciones de alto rendimiento, ayudándole con la IBO Player activation instantánea o la configuración en TiviMate, Smart IPTV y Duplex Play. Al comprar su suscripción, enviamos las credenciales al instante por WhatsApp con soporte técnico 24/7."
      },
      {
        question: "¿Es RedStream considerado el mejor IPTV para Smart TV?",
        answer: "¡Totalmente! RedStream es aclamado como el best IPTV for Smart TV, optimizado para televisores Samsung (Tizen OS), LG (webOS) y Android TV (Sony, Philips, Hisense). Nuestras transmisiones utilizan códecs de compresión avanzados que los reproductores nativos de televisión decodifican sin esfuerzo, logrando un cambio de canal en menos de 1 segundo y navegación fluida. También está optimizado para Amazon Firestick, Apple TV y dispositivos Android."
      },
      {
        question: "¿Experimentaré congelaciones o buffering durante transmisiones de deportes en vivo?",
        answer: "¡No! Garantizamos una experiencia con zero buffering (cero almacenamiento en búfer) en eventos deportivos en directo de gran tráfico. Mientras otros servicios fallan por la saturación, RedStream utiliza Anti-Freeze server technology con balanceadores de carga inteligentes que distribuyen el tráfico de manera dinámica. Así disfrutará de 4K streaming and live sports fluidos y sin interrupciones en tiempo real."
      },
      {
        question: "¿Qué tan rápido es el proceso de configuración y activación?",
        answer: "¡El proceso es prácticamente instantáneo! Al confirmar su compra, generamos sus credenciales y las enviamos a nuestro soporte de WhatsApp en un plazo de 10 a 15 minutos. Le ayudaremos paso a paso con la IPTV Smarters Pro setup, el código de IBO Player activation o la configuración en su Smart TV. No cerramos el chat hasta que esté reproduciendo sus canales favoritos en 4K."
      },
      {
        question: "¿Puedo usar mi suscripción en múltiples dispositivos simultáneamente?",
        answer: "Puede instalar su suscripción en todos los dispositivos que desee (Smart TV, móvil, tableta, PC, Firestick), pero para mantener la máxima estabilidad y disfrutar de una transmisión con zero buffering, nuestro plan estándar permite una sola reproducción activa a la vez. Si necesita reproducir en múltiples pantallas al mismo tiempo, contáctenos por WhatsApp para obtener un paquete multi-room con un gran descuento."
      }
    ]
  },
  de: {
    title: "Häufig Gestellte Fragen",
    subtitle: "Alles, was Sie über die Einrichtung und das Streaming mit RedStream IPTV wissen müssen.",
    items: [
      {
        question: "Was macht RedStream zum besten Premium-IPTV-Abonnement auf dem Markt?",
        answer: "Die Wahl des best premium IPTV subscription (besten Premium-IPTV-Abonnements) ist entscheidend für erstklassiges Heimkino. RedStream setzt Maßstäbe, da wir modernste Anti-Freeze server technology (Anti-Freeze-Server-Technologie) mit einer High-End-Infrastruktur kombinieren. Wir nutzen keine überlasteten öffentlichen Streams, sondern investieren in private Hochgeschwindigkeits-Servercluster mit dedizierten Load-Balancern. Dies garantiert 99,9 % Uptime und ruckelfreies Streaming. Erleben Sie glasklares 4K streaming and live sports (4K-Streaming und Live-Sport) mit minimaler Latenz."
      },
      {
        question: "Welche Apps werden unterstützt und wie funktioniert die Einrichtung von IPTV Smarters Pro oder IBO Player?",
        answer: "Wir unterstützen das gesamte Spektrum moderner Streaming-Apps. Für eine intuitive Bedienung bieten wir eine bebilderte Anleitung für das IPTV Smarters Pro setup. Zudem unterstützen wir Sie bei der schnellen IBO Player activation sowie der Einrichtung auf TiviMate, Smart IPTV und Duplex Play. Nach dem Kauf senden wir Ihnen die Zugangsdaten sofort per WhatsApp und unser technischer Support steht Ihnen rund um die Uhr zur Seite."
      },
      {
        question: "Ist RedStream das beste IPTV für Smart TV-Plattformen?",
        answer: "Absolut! RedStream gilt als das best IPTV for Smart TV, perfekt optimiert für Samsung Smart TV (Tizen OS), LG Smart TV (webOS) und Android-basierte Fernseher (Sony, Philips, Hisense). Unsere Streams nutzen fortschrittliche Codecs, die Smart-TVs mühelos dekodieren. Das Ergebnis sind Umschaltzeiten unter 1 Sekunde und flüssiges Zapping. Auch für Amazon Firestick, Apple TV und Android-Boxen ist der Dienst optimal."
      },
      {
        question: "Wird es beim Live-Sport zu Rucklern oder Buffering kommen?",
        answer: "Nein! Wir garantieren eine Übertragung mit zero buffering (ohne Buffering), speziell optimiert für globale Live-Events. RedStream löst Überlastungsprobleme durch den Einsatz unserer proprietären Anti-Freeze server technology mit intelligenter Lastverteilung. Egal ob Champions League, Formel 1 oder Pay-per-View-Events – Sie genießen 4K streaming and live sports ohne Unterbrechungen in Echtzeit."
      },
      {
        question: "Wie schnell erfolgt die Einrichtung und Freischaltung?",
        answer: "Die Aktivierung läuft extrem schnell! Direkt nach Zahlungseingang generiert unser System Ihre Zugangsdaten und sendet sie an unser WhatsApp-Supportteam. Ein Support-Mitarbeiter liefert Ihre M3U-Wiedergabeliste und Xtream Codes innerhalb von 10 bis 15 Minuten. Wir begleiten Sie durch das IPTV Smarters Pro setup oder die IBO Player activation, bis die ersten Kanäle fehlerfrei in 4K laufen."
      },
      {
        question: "Kann ich mein Abonnement auf mehreren Geräten gleichzeitig nutzen?",
        answer: "Sie können Ihre RedStream-Zugangsdaten auf beliebig vielen Geräten einrichten (Smart TV, Smartphone, Tablet, PC, Firestick). Um jedoch die Serverstabilität und ein Erlebnis mit zero buffering zu gewährleisten, unterstützt unser Standard-Tarif jeweils eine aktive Verbindung. Für gleichzeitiges Streaming auf mehreren Geräten bieten wir stark rabattierte Multi-Screen-Pakete per WhatsApp an."
      }
    ]
  },
  nl: {
    title: "Veelgestelde Vragen",
    subtitle: "Alles wat u moet weten over de installatie en het streamen met RedStream IPTV.",
    items: [
      {
        question: "Wat maakt RedStream het beste premium IPTV-abonnement op de markt?",
        answer: "Het kiezen van het best premium IPTV subscription (beste premium IPTV-abonnement) is essentieel voor de ultieme tv-ervaring. RedStream onderscheidt zich door de inzet van geavanceerde Anti-Freeze server technology gekoppeld aan een ultramoderne serverinfrastructuur. Wij maken geen gebruik van overbelaste openbare streams; we investeren in private high-bandwidth serverclusters met load-balancers. Dit garandeert een uptime van 99.9% en vloeiend streamen zonder haperingen. Geniet van haarscherpe 4K streaming and live sports met minimale vertraging."
      },
      {
        question: "Welke apps ondersteunen jullie en hoe werkt de IPTV Smarters Pro of IBO Player activatie?",
        answer: "Wij ondersteunen vrijwel alle populaire streaming-apps. Voor een eenvoudige, rijke interface bieden we volledige begeleiding bij de IPTV Smarters Pro setup. Daarnaast helpen we u bij de directe IBO Player activation of installatie op TiviMate, Smart IPTV en Duplex Play. Na aankoop sturen we uw inloggegevens direct via WhatsApp, en onze technische helpdesk is 24/7 beschikbaar om u op weg te helpen."
      },
      {
        question: "Wordt RedStream gezien als de beste IPTV voor Smart TV?",
        answer: "Zeker weten! RedStream is geoptimaliseerd als de best IPTV for Smart TV, specifiek voor Samsung Smart TV (Tizen OS), LG Smart TV (webOS) en Android TV's (Sony, Philips, Hisense). Onze streams gebruiken moderne codecs die televisies moeitensloos decoderen. Dit zorgt voor razendsnelle zaptijden (minder dan 1 seconde). De dienst werkt ook perfect op Amazon Firestick, Apple TV en Android-boxen."
      },
      {
        question: "Zal ik haperingen of buffering ervaren tijdens live sportwedstrijden?",
        answer: "Nee! Wij garanderen een ervaring met zero buffering (geen haperingen), speciaal ontwikkeld voor live sportevenementen met veel kijkers. RedStream voorkomt overbelasting door onze Anti-Freeze server technology met proactieve schaling. Of u nu kijkt naar de Champions League, Formule 1 of UFC-gevechten, u geniet van vloeiende 4K streaming and live sports in real-time, zonder onderbrekingen."
      },
      {
        question: "Hoe snel is de installatie en activatie?",
        answer: "De installatie is vrijwel direct! Zodra de betaling is afgerond, genereert ons systeem uw inloggegevens en stuurt deze naar ons WhatsApp-supportteam. Binnen 10 tot 15 minuten ontvangt u uw M3U-afspeellijst en Xtream Codes. We loodsen u stap voor stap door de IPTV Smarters Pro setup of IBO Player activation heen, totdat alles soepel in 4K afspeelt."
      },
      {
        question: "Kan ik mijn abonnement op meerdere apparaten tegelijkertijd gebruiken?",
        answer: "U kunt uw RedStream-abonnement op al uw apparaten installeren (Smart TV, smartphone, tablet, pc, Firestick). Om de serverkwaliteit en een stream met zero buffering te garanderen, staat ons standaardpakket één actieve stream tegelijkertijd toe. Wilt u op meerdere apparaten tegelijk kijken? Vraag onze WhatsApp-support naar de scherp geprijsde multi-room pakketten."
      }
    ]
  },
  ru: {
    title: "Часто Задаваемые Вопросы",
    subtitle: "Все, что вам нужно знать о настройке и просмотре трансляций с RedStream IPTV.",
    items: [
      {
        question: "Что делает RedStream лучшей премиальной подпиской на IPTV?",
        answer: "Выбор best premium IPTV subscription (лучшей премиум подписки) критически важен для качественного просмотра. RedStream выделяется благодаря передовой Anti-Freeze server technology (технологии защиты от зависаний) и мощной инфраструктуре серверов. Мы не используем перегруженные публичные потоки, а инвестируем в частные высокоскоростные серверные кластеры с балансировщиками нагрузки. Это гарантирует 99.9% стабильности и плавный просмотр без задержек. Наш сервис предлагает кристально чистый 4K streaming and live sports (стриминг в 4K и спортивные трансляции) с ультранизкой задержкой."
      },
      {
        question: "Какие приложения вы поддерживаете и как настроить IPTV Smarters Pro или активировать IBO Player?",
        answer: "Мы поддерживаем все популярные плееры. Для тех, кто предпочитает простой интерфейс, мы предлагаем пошаговое руководство для IPTV Smarters Pro setup (настройки IPTV Smarters Pro). Также мы помогаем с мгновенной IBO Player activation (активацией IBO Player) и установкой на TiviMate, Smart IPTV и Duplex Play. Сразу после оплаты вы получите все доступы через WhatsApp, а наша техподдержка работает 24/7."
      },
      {
        question: "Считается ли RedStream лучшим IPTV для Smart TV?",
        answer: "Абсолютно! RedStream признан как best IPTV for Smart TV (лучший IPTV для Smart TV), оптимизированный для Samsung (Tizen OS), LG (webOS) и Android TV (Sony, Philips, Hisense). Наши трансляции сжимаются современными кодеками, которые телевизоры декодируют мгновенно. Переключение каналов занимает менее 1 секунды. Сервис также идеально оптимизирован под Amazon Firestick, Apple TV и Android приставки."
      },
      {
        question: "Будут ли зависания во время прямых трансляций спорта?",
        answer: "Нет! Мы гарантируем просмотр с zero buffering (без буферизации), созданный для пиковых нагрузок во время важных матчей. RedStream решает проблему перегрузок благодаря Anti-Freeze server technology и динамическому распределению трафика. Будь то Лига Чемпионов, Формула 1 или бои UFC, вы получите идеальный 4K streaming and live sports в реальном времени."
      },
      {
        question: "Как быстро происходит настройка и активация подписки?",
        answer: "Активация происходит практически мгновенно! После подтверждения заказа система создает доступы и передает их в WhatsApp. В течение 10–15 минут оператор отправит ваш M3U-плейлист и Xtream-коды. Мы поможем вам настроить IPTV Smarters Pro setup, ввести код для IBO Player activation или настроить ваш Smart TV, пока все не заработает в 4K."
      },
      {
        question: "Могу ли я использовать подписку на нескольких устройствах одновременно?",
        answer: "Вы можете установить плейлист на любые свои устройства (Smart TV, смартфон, планшет, ПК, Firestick). Однако для поддержания стабильности и стриминга с zero buffering стандартный тариф поддерживает только одно активное подключение в один момент времени. Если вам нужно смотреть разные каналы одновременно на нескольких экранах, напишите нам в WhatsApp, и мы подберем выгодный мультирум-тариф."
      }
    ]
  },
  ar: {
    title: "الأسئلة الشائعة والاستفسارات",
    subtitle: "كل ما تحتاج إلى معرفته حول إعداد وتشغيل خدمة RedStream IPTV الممتازة.",
    items: [
      {
        question: "ما الذي يجعل RedStream أفضل اشتراك IPTV ممتاز (best premium IPTV subscription) في السوق؟",
        answer: "يعد اختيار أفضل اشتراك IPTV متميز (best premium IPTV subscription) أمرًا حيويًا للحصول على تجربة ترفيه منزلي مثالية. يتميز RedStream كخيار أول بفضل تقنيتنا المتطورة Anti-Freeze server technology (تقنية منع التقطيع) المقترنة ببنية تحتية قوية للخوادم الخاصة ذات النطاق العريض. نحن لا نستخدم البثوث العامة المزدحمة، بل نستثمر في خوادم خاصة سريعة تضمن استقرارًا بنسبة 99.9% وتشغيلًا سلسًا للغاية. ستحصل على بث بجودة 4K streaming and live sports (بث 4K والرياضات المباشرة) دون أي انقطاع وبأقل زمن تأخير ممكن."
      },
      {
        question: "ما هي التطبيقات التي تدعمونها، وكيف أقوم بإعداد IPTV Smarters Pro أو تفعيل IBO Player؟",
        answer: "نحن ندعم طيفًا واسعًا من تطبيقات البث الذكية. بالنسبة للعملاء الذين يفضلون واجهة غنية وسهلة، نقدم دعمًا وإرشادات كاملة لـ IPTV Smarters Pro setup (إعداد تطبيق سمارترز). كما نساعدك في تفعيل تطبيق إيبو بلاير فورًا (IBO Player activation) أو التشغيل على تطبيقات TiviMate و Smart IPTV و Duplex Play. بعد الشراء، نرسل بياناتك فورًا عبر WhatsApp مع توفير دعم فني مخصص على مدار الساعة 24/7 لضمان سهولة الإعداد."
      },
      {
        question: "هل يعتبر RedStream أفضل اشتراك IPTV للشاشات الذكية (best IPTV for Smart TV)؟",
        answer: "بكل تأكيد! يعتبر RedStream على نطاق واسع بمثابة أفضل IPTV للشاشات الذكية (best IPTV for Smart TV)، وهو متوافق ومحسن بشكل مثالي لشاشات سامسونج (Tizen OS)، وإل جي (webOS)، وشاشات أندرويد (مثل سوني، وفيليبس، وهايسنس). تستخدم خوادمنا برمجيات ترميز متقدمة تفك الشاشات تشفيرها بسهولة، مما يمنحك سرعة تنقل فائقة بين القنوات في أقل من ثانية واحدة، بالإضافة إلى التوافق التام مع أجهزة Amazon Firestick و Apple TV وأجهزة أندرويد بوكس."
      },
      {
        question: "هل سأواجه أي تقطيع أو بطء (buffering) أثناء بث المباريات والرياضات المباشرة؟",
        answer: "كلا على الإطلاق! نحن نضمن لك تجربة مشاهدة خالية من التقطيع (zero buffering)، مصممة خصيصًا للأحداث المباشرة الكبرى. تحل RedStream مشكلة التكدس في أوقات الذروة من خلال تشغيل Anti-Freeze server technology وتوزيع حركة البث ديناميكيًا. سواء كنت تتابع دوري أبطال أوروبا، الفورمولا 1، أو نزالات الملاكمة، ستستمتع بالبث الفائق 4K streaming and live sports في الوقت الفعلي بثبات تام كالاشتراك الرسمي."
      },
      {
        question: "ما هي سرعة عملية الإعداد والتفعيل للاشتراك الخاص بي؟",
        answer: "التفعيل فوري وشبه لحظي! بمجرد تأكيد طلبك الآمن، يولد نظامنا بيانات الدخول ويرسلها فورًا إلى فريق الدعم عبر واتساب. في غضون 10 إلى 15 دقيقة، سيسلمك الوكيل رابط M3U وبيانات Xtream Codes، ويرشدك خطوة بخطوة لإتمام IPTV Smarters Pro setup أو كود تفعيل IBO Player activation والتشغيل على شاشتك حتى تعمل أول قناة أمامك بجودة 4K."
      },
      {
        question: "هل يمكنني تشغيل اشتراكي على عدة أجهزة في نفس الوقت؟",
        answer: "يمكنك تثبيت اشتراك RedStream على أي عدد تريده من الأجهزة (الشاشة الذكية، الهاتف، الجهاز اللوحي، الكمبيوتر، الفاير ستيك)، ولكن لضمان جودة البث وثباته مع ميزة zero buffering، فإن اشتراكنا القياسي يدعم تشغيل جهاز واحد في نفس الوقت. إذا كنت بحاجة لتشغيل البث على عدة أجهزة في وقت واحد دون انقطاع، يرجى التواصل مع فريقنا عبر واتساب للحصول على باقة عائلية (multi-room) مخفضة للغاية ومناسبة لاحتياجاتك."
      }
    ]
  }
};

interface FAQSectionProps {
  currentLang: Language;
}

export default function FAQSection({ currentLang }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const t = faqTranslations[currentLang] || faqTranslations.en;
  const isRtl = currentLang === 'ar';

  // Inject valid combined Product and FAQPage Schema Markup into head
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          "name": "RedStream™ Premium IPTV Subscription",
          "image": "https://www.red-stream.store/1000148211-iptv-france.webp",
          "description": "Stream over 20,000+ live premium TV channels and 60,000+ blockbuster movies & VOD in stunning Ultra HD 4K with Anti-Freeze 9.0 Technology.",
          "sku": "REDSTREAM-PREMIUM",
          "mpn": "RS-PREMIUM-01",
          "brand": {
            "@type": "Brand",
            "name": "RedStream™"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "15340",
            "bestRating": "5",
            "worstRating": "1"
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "EUR",
            "lowPrice": "2.00",
            "highPrice": "49.00",
            "offerCount": "4",
            "offers": [
              {
                "@type": "Offer",
                "name": "24 Hours Trial",
                "price": "2.00",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2027-12-31",
                "url": "https://www.red-stream.store/"
              },
              {
                "@type": "Offer",
                "name": "1 Month Premium Plan",
                "price": "12.00",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2027-12-31",
                "url": "https://www.red-stream.store/"
              },
              {
                "@type": "Offer",
                "name": "6 Months Premium Plan",
                "price": "29.00",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2027-12-31",
                "url": "https://www.red-stream.store/"
              },
              {
                "@type": "Offer",
                "name": "12 Months Premium Plan",
                "price": "49.00",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2027-12-31",
                "url": "https://www.red-stream.store/"
              }
            ]
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": t.items.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        }
      ]
    };

    let script = document.getElementById('dynamic-faq-schema') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'dynamic-faq-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById('dynamic-faq-schema');
      if (existingScript && document.head.contains(existingScript)) {
        document.head.removeChild(existingScript);
      }
    };
  }, [currentLang, t]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getIcon = (index: number) => {
    switch (index) {
      case 0: return <Shield className="w-5 h-5 text-[#e50914] shrink-0" />;
      case 1: return <Zap className="w-5 h-5 text-[#e50914] shrink-0" />;
      case 2: return <Tv className="w-5 h-5 text-[#e50914] shrink-0" />;
      case 3: return <Activity className="w-5 h-5 text-[#e50914] shrink-0" />;
      case 4: return <Play className="w-5 h-5 text-[#e50914] shrink-0" />;
      default: return <Smartphone className="w-5 h-5 text-[#e50914] shrink-0" />;
    }
  };

  return (
    <section className="faq py-24 bg-[#080808] border-t border-[#1a1a1a] border-b border-[#1a1a1a]" id="faq">
      <div className="container max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16 max-w-[700px] mx-auto">
          <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-white uppercase tracking-tight italic mb-4">
            {t.title}
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-[850px] mx-auto flex flex-col gap-4" dir={isRtl ? "rtl" : "ltr"}>
          {t.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-[#111111] border rounded-xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'border-[#e50914] shadow-[0_10px_30px_rgba(229,9,20,0.15)]' 
                    : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
                }`}
              >
                <button
                  className="w-full text-left flex items-center justify-between p-6 md:p-7 gap-4 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#e50914]/50"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 text-left">
                    {getIcon(index)}
                    <span className="font-semibold text-white text-base md:text-lg leading-snug hover:text-white transition-colors">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#e50914] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 md:p-7 pt-0 md:pt-0 text-gray-400 text-sm md:text-base leading-relaxed border-t border-[#1a1a1a]/50 mt-4 mx-6 md:mx-7">
                      <p className="pt-4">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
