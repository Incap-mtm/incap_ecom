import React, { useState } from 'react';

const CHANNELS = [
  { label: 'Recepción de documentos', value: 'Cra 72 # 62 - 27 sur' },
  { label: 'Teléfono', value: '(601) 7761800' },
  { label: 'Correo electrónico', value: 'protecciondedatos@incap.com.co' },
  { label: 'Página web', value: 'incap.dataprotected.co' },
];

const DEFINITIONS = [
  { term: 'Autorización', def: 'Consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento de datos personales.' },
  { term: 'Base de Datos', def: 'Conjunto organizado de datos personales que sea objeto de Tratamiento.' },
  { term: 'Dato personal', def: 'Cualquier información vinculada o que pueda asociarse a una o a varias personas naturales determinadas o determinables.' },
  { term: 'Dato semiprivado', def: 'Datos cuyo conocimiento puede interesar a su titular o a un grupo de personas. Requieren autorización expresa. Ej.: datos financieros, datos de seguridad social.' },
  { term: 'Dato sensible', def: 'Datos que afectan la intimidad del Titular o cuyo uso indebido puede generar discriminación (origen racial, orientación política, salud, vida sexual, datos biométricos, etc.).' },
  { term: 'Dato privado', def: 'Dato de naturaleza íntima o reservada que solo interesa a su Titular y requiere su autorización expresa.' },
  { term: 'Dato público', def: 'Dato que la Constitución o normas han determinado expresamente como público. No requiere autorización para su recolección.' },
  { term: 'Encargado del Tratamiento', def: 'Persona natural o jurídica que realice el Tratamiento de datos personales por cuenta del Responsable.' },
  { term: 'Responsable del Tratamiento', def: 'Persona natural o jurídica que decide sobre la base de datos y/o el Tratamiento de los datos.' },
  { term: 'Titular', def: 'Persona natural cuyos datos personales sean objeto de Tratamiento.' },
  { term: 'Tratamiento', def: 'Cualquier operación sobre datos personales: recolección, almacenamiento, uso, circulación o supresión.' },
  { term: 'Transferencia', def: 'Envío de datos personales desde Colombia a un receptor Responsable del Tratamiento, dentro o fuera del país.' },
  { term: 'Transmisión', def: 'Comunicación de datos dentro o fuera del territorio de Colombia cuando tiene por objeto la realización de un Tratamiento por el Encargado.' },
];

const PURPOSES: Record<string, string[]> = {
  Clientes: [
    'Mantener un registro histórico, científico o estadístico',
    'Generar modelos y datos para la toma de decisiones',
    'Atender requerimientos de autoridades judiciales o administrativas',
    'Remitir información relacionada con el objeto social de la organización',
    'Gestionar las relaciones, derechos y deberes con los titulares',
    'Gestionar y mantener un histórico de relaciones comerciales',
    'Adelantar el ofrecimiento de productos y servicios',
    'Realizar encuestas de opinión',
    'Adelantar comunicaciones vía correo electrónico, SMS, teléfono u otro medio',
    'Realizar la verificación de cumplimientos legales o normativos',
    'Realizar actividades de gestión administrativa',
    'Generar facturas',
    'Recibir y gestionar requerimientos sobre productos o servicios (PQR)',
    'Cumplir con los requisitos legales para la prevención del lavado de activos y financiación del terrorismo',
    'Adelantar comunicaciones a distancia para la venta de productos o servicios',
    'Realizar análisis de perfiles y actividades de fidelización',
    'Realizar actividades de marketing tradicional o digital',
    'Cumplir con los requisitos legales asociados a la formalización de contratos',
  ],
  'Proveedores y Contratistas': [
    'Mantener un registro histórico, científico o estadístico',
    'Remitir información relacionada con el objeto social de la organización',
    'Gestionar las relaciones, derechos y deberes con los titulares',
    'Adelantar comunicaciones vía correo electrónico, SMS, teléfono u otro medio',
    'Realizar la verificación de cumplimientos legales o normativos',
    'Recibir y gestionar requerimientos sobre productos o servicios (PQR)',
    'Cumplir con los requisitos legales para la prevención del lavado de activos y financiación del terrorismo',
    'Cumplir los deberes económicos y contables de la organización',
    'Realizar actividades de cobro y pago',
    'Cumplir lo dispuesto en materia de seguridad y salud en el trabajo',
    'Gestión y trámite de requerimientos de entidades de salud y seguridad social',
    'Adelantar procedimientos administrativos y de control interno',
    'Realizar la verificación de requisitos jurídicos, técnicos y/o financieros',
    'Cumplir con los requisitos legales asociados a la formalización de contratos',
  ],
  Trabajadores: [
    'Mantener un registro histórico, científico o estadístico',
    'Gestionar las relaciones, derechos y deberes con los titulares',
    'Adelantar comunicaciones vía correo electrónico, SMS, teléfono u otro medio',
    'Cumplir con los requisitos legales para la prevención del lavado de activos',
    'Cumplir los requisitos de gestión de riesgos laborales',
    'Gestionar las actividades asociadas al manejo de personal',
    'Cumplir lo dispuesto en materia laboral y de seguridad social',
    'Gestionar y realizar el pago de nómina y prestaciones sociales',
    'Adelantar la gestión de riesgos laborales y prevención de enfermedades y accidentes',
    'Realizar control de horario y gestionar riesgos dentro de las instalaciones',
    'Gestión y trámite de requerimientos de entidades de salud y seguridad social',
    'Adelantar la administración de sistemas de información, gestión de claves y usuarios',
    'Controlar el acceso y salida de personas en las instalaciones',
    'Adelantar procedimientos administrativos y de control interno',
    'Cumplir con la declaración y pago de aportes de seguridad social',
    'Realizar procesos de formación de personal interno',
  ],
  'Candidatos y Aspirantes': [
    'Gestionar las relaciones, derechos y deberes con los titulares',
    'Realizar actividades de gestión administrativa',
    'Realizar la verificación de datos y referencias',
    'Gestionar la seguridad en todos sus aspectos',
    'Realizar análisis de perfiles',
    'Realizar la selección y promoción de oportunidades laborales',
    'Generar estadísticas internas',
    'Promocionar y gestionar ofertas de empleo',
    'Alimentar la base de datos de candidatos para futuras oportunidades',
    'Realizar convocatorias o citas para entrevistas o pruebas',
  ],
  Visitantes: [
    'Atender requerimientos de autoridades judiciales o administrativas',
    'Gestionar las relaciones, derechos y deberes con los titulares',
    'Adelantar comunicaciones vía correo electrónico, SMS, teléfono u otro medio',
    'Recibir y gestionar requerimientos sobre productos o servicios (PQR)',
    'Adelantar investigaciones en caso de situaciones de riesgo o violaciones a la seguridad',
    'Gestionar la seguridad en todos sus aspectos',
    'Gestionar riesgos o accidentes dentro de las instalaciones',
    'Controlar el acceso y salida de personas en las instalaciones',
    'Realizar el registro de entrada y salida de activos, paquetes y documentos',
    'Generar estadísticas internas',
  ],
};

const RIGHTS = [
  'Acceder en forma gratuita a sus datos personales que hayan sido objeto de Tratamiento.',
  'Conocer, actualizar y rectificar su información frente a datos parciales, inexactos, incompletos, fraccionados o que induzcan a error.',
  'Conocer por qué y para qué INCAP S A recolecta información en base de datos.',
  'Revocar la autorización dada y/o solicitar la supresión de sus datos, siempre que no exista un deber legal o contractual que impida eliminarlos.',
  'Presentar queja ante la Superintendencia de Industria y Comercio cuando INCAP S A no haya atendido satisfactoriamente consultas o reclamos.',
  'Solicitar prueba de la autorización otorgada al responsable del tratamiento.',
  'Abstenerse de responder las preguntas sobre datos sensibles o datos de niños, niñas y adolescentes.',
];

const NAV_SECTIONS = [
  { id: 'general', label: 'Información General', icon: '🏢' },
  { id: 'definiciones', label: 'Definiciones', icon: '📖' },
  { id: 'tratamiento', label: 'Tratamiento de Datos', icon: '⚙️' },
  { id: 'derechos', label: 'Tus Derechos', icon: '⚖️' },
  { id: 'aspectos', label: 'Aspectos Finales', icon: '📋' },
  { id: 'avisos', label: 'Avisos de Privacidad', icon: '📢' },
];

function ContactCard() {
  return (
    <div className="bg-[#2A4899] rounded-2xl p-6 mt-8">
      <p className="text-[#85C639] font-black text-[10px] uppercase tracking-[0.3em] mb-3">Ejercer tus derechos</p>
      <p className="text-white font-bold text-sm mb-4">Canales habilitados para consultas y reclamos:</p>
      <div className="space-y-2">
        {CHANNELS.map((ch) => (
          <div key={ch.label} className="flex flex-col">
            <span className="text-white/50 text-[10px] uppercase tracking-widest">{ch.label}</span>
            <span className="text-white text-xs font-semibold">{ch.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionGeneral() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Responsable del Tratamiento</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {[
                ['Razón social', 'INCAP S A'],
                ['NIT', '860025998-3'],
                ['Dirección', 'CR 72 62 27 SUR'],
                ['Correo electrónico', 'dmarroquin@incap.com.co'],
                ['Teléfono', '6017761800'],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-slate-500 font-semibold text-xs uppercase tracking-wide w-40">{k}</td>
                  <td className="py-2 text-[#181B1C] font-medium">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Objetivo</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Establecer los criterios bajo los cuales se realiza el tratamiento de la información personal que reposa en las bases de datos, archivos físicos y digitales de <strong>INCAP S A</strong>, dando cumplimiento al artículo 15 y 20 de la Constitución Nacional, la Ley 1581 de 2012, el Capítulo 25 del Decreto 1074 de 2015 y la Sentencia C-748 de 2011.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Alcance</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Esta política aplica para toda la información personal registrada en las bases de datos de <strong>INCAP S A</strong> y está dirigida a cualquier titular de la información o su representante legal de quien INCAP S A haya requerido información personal para el desarrollo de alguna actividad.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed mt-3">
          Establece los criterios para el tratamiento, los mecanismos para que los titulares puedan ejercer sus derechos, las finalidades, las medidas de seguridad y otros aspectos relacionados con la protección de la información personal.
        </p>
      </div>
    </div>
  );
}

function SectionDefiniciones() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {DEFINITIONS.map((d) => (
        <div key={d.term} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
            onClick={() => setOpen(open === d.term ? null : d.term)}
          >
            <span className="font-bold text-[#2A4899] text-sm">{d.term}</span>
            <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open === d.term ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === d.term && (
            <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
              {d.def}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionTratamiento() {
  const [activeTab, setActiveTab] = useState('Clientes');
  const stakeholders = Object.keys(PURPOSES);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Tipos de datos tratados</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['Académicos', 'Características personales', 'Circunstancias sociales', 'Contacto', 'Electrónicos', 'Identificativos', 'Laborales', 'Patrimoniales', 'Públicos'].map((t) => (
            <div key={t} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#85C639] flex-shrink-0" />
              <span className="text-slate-700 text-xs font-medium">{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Operaciones sobre los datos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { op: 'Recolección', desc: 'Se obtiene directamente del titular, de un tercero con autorización, o de fuentes públicas, a través de medios físicos, digitales o electrónicos, con aviso de privacidad y autorización.' },
            { op: 'Almacenamiento', desc: 'En servidores propios o externos de terceros, con medidas de seguridad física, técnica y administrativa. La información se conserva mientras la finalidad esté vigente o lo exija la ley.' },
            { op: 'Circulación', desc: 'Por regla general no se comparten datos con terceros. Solo se entrega a otras entidades cuando sea necesario para el cumplimiento de obligaciones legales.' },
            { op: 'Supresión', desc: 'Procede cuando se ha cumplido la finalidad, no existen obligaciones legales de conservación, no afecta la integridad de las bases de datos, o es solicitada por el titular.' },
          ].map(({ op, desc }) => (
            <div key={op} className="border border-slate-200 rounded-xl p-4">
              <p className="font-black text-[#2A4899] text-xs uppercase tracking-widest mb-2">{op}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-1 pb-2 border-b-2 border-[#85C639]">Finalidades por tipo de titular</h3>
        <p className="text-slate-500 text-xs mb-4">Selecciona el tipo de titular para ver las finalidades aplicables.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {stakeholders.map((s) => (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${activeTab === s ? 'bg-[#2A4899] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <ul className="space-y-1.5">
          {PURPOSES[activeTab].map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#85C639] mt-1.5 flex-shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Datos sensibles</h3>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Datos de salud</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Se tratan exclusivamente para: gestión administrativa, cumplimiento de normas de seguridad y salud en el trabajo, trámites ante entidades de salud y seguridad social, gestión de riesgos laborales, prevención de enfermedades y accidentes, y verificación de riesgo de salud.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Datos de menores de edad</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          INCAP S A puede requerir datos de menores únicamente para cumplir obligaciones legales (Ley 789 de 2002 — vinculación de aprendices; afiliación a seguridad social de dependientes). En caso de recolección directa de datos de menores, se solicitará autorización con consentimiento informado de los padres o adultos responsables.
        </p>
      </div>
    </div>
  );
}

function SectionDerechos() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Derecho de Habeas Data</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">Como titular de tus datos personales, tienes derecho a:</p>
        <ul className="space-y-3">
          {RIGHTS.map((r, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2A4899] text-white text-[10px] font-black flex items-center justify-center mt-0.5">{String.fromCharCode(97 + i).toUpperCase()}</span>
              <span className="text-slate-600 text-sm leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Tiempos de atención</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border-l-4 border-[#2A4899] pl-4">
            <p className="font-black text-[#2A4899] text-sm uppercase tracking-wide mb-2">Consulta</p>
            <p className="text-slate-600 text-sm leading-relaxed">Máximo <strong>10 días hábiles</strong> desde la recepción. Si no es posible, se informa y se responde en los <strong>5 días hábiles</strong> siguientes.</p>
          </div>
          <div className="border-l-4 border-[#85C639] pl-4">
            <p className="font-black text-[#2A4899] text-sm uppercase tracking-wide mb-2">Reclamo</p>
            <p className="text-slate-600 text-sm leading-relaxed">Máximo <strong>15 días hábiles</strong> desde la recepción. Si no es posible, se informa y se responde en los <strong>8 días hábiles</strong> siguientes.</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 mt-4 text-xs text-slate-500 leading-relaxed">
          Si el reclamo está incompleto, tienes <strong>5 días</strong> para subsanarlo. Transcurridos 2 meses sin aportar la información solicitada, se entiende que has desistido del reclamo.
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Cómo ejercer tus derechos</h3>
        <p className="text-slate-600 text-sm mb-3">Puedes ejercer tus derechos si eres titular o representante legal. Debes aportar:</p>
        <ul className="space-y-1.5 mb-4">
          {[
            'Nombres y apellidos completos',
            'Tipo y número de identificación',
            'Datos de contacto (dirección, correo, teléfono)',
            'Descripción del derecho que deseas ejercer',
            'Fotocopia del documento de identidad u otro documento que acredite tu representación',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2A4899] mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="bg-[#2A4899]/5 border border-[#2A4899]/20 rounded-xl p-4 text-sm text-slate-600 leading-relaxed">
          <strong className="text-[#2A4899]">Responsable interno:</strong> Asistente de Tesorería de INCAP S A, quien también podrá requerir otras áreas para verificar el cumplimiento de la normativa.
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Canales de atención</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CHANNELS.map((ch) => (
            <div key={ch.label} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
              <div className="w-2 h-2 rounded-full bg-[#85C639] mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ch.label}</p>
                <p className="text-sm font-semibold text-[#181B1C]">{ch.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionAspectos() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Disposiciones permanentes</h3>
        <div className="space-y-3">
          {[
            { title: 'Vínculo con la política', desc: 'Cualquier titular de la información que tenga alguna relación con INCAP S A deberá acatar la presente política.' },
            { title: 'Principios garantizados', desc: 'INCAP S A garantiza los principios de legalidad, finalidad, libertad, veracidad o calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.' },
            { title: 'Inscripción RNBD', desc: 'INCAP S A llevará a cabo la inscripción de sus bases de datos conforme al Decreto 090 de enero de 2018 que modifica el Decreto 1074 de 2015.' },
          ].map(({ title, desc }) => (
            <div key={title} className="border border-slate-200 rounded-xl p-4">
              <p className="font-black text-[#2A4899] text-xs uppercase tracking-widest mb-2">{title}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Vigencia</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Las bases de datos tendrán una vigencia igual al tiempo en que se mantenga y utilice la información para las finalidades descritas en esta política. Los datos se conservarán mientras se mantenga la relación contractual con el Titular o mientras no se solicite su supresión, siempre que no exista un deber legal de conservarlos.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Versión y vigencia</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {[
                ['Versión', '2'],
                ['Fecha de entrada en vigor', '28/03/2025'],
                ['Reemplaza la política anterior de', '31/03/2022'],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-slate-500 font-semibold text-xs uppercase tracking-wide w-52">{k}</td>
                  <td className="py-2 text-[#181B1C] font-medium">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Actualización de canales — 10/MAR/2025</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          INCAP S A actualizó sus canales de atención para gestionar solicitudes, consultas y reclamos relacionados con el tratamiento de datos personales, fortaleciendo la capacidad de respuesta y facilitando el ejercicio de derechos mediante medios modernos y con disponibilidad continua.
        </p>
      </div>
    </div>
  );
}

function SectionAvisos() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Video Vigilancia (CCTV)</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Los videos y/o audios obtenidos a través del CCTV o cámaras de vigilancia son almacenados de manera temporal y confidencial. <strong>El ingreso voluntario a las instalaciones constituye autorización libre, previa e informada</strong> para la captación de imagen y tratamiento de datos conforme a las siguientes finalidades:
        </p>
        <ul className="space-y-1.5 mb-6">
          {[
            'Atender requerimientos de autoridades judiciales o administrativas',
            'Realizar actividades de gestión administrativa',
            'Adelantar investigaciones ante situaciones de riesgo o violaciones a la seguridad',
            'Gestionar la seguridad en todos sus aspectos',
            'Preservar la seguridad de los activos y personas',
            'Gestionar riesgos o accidentes dentro de las instalaciones',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2A4899] mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Datos de menores de edad (todos los avisos)</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Si proporciona datos de un menor, declara ser padre, madre, tutor o representante legal y autoriza su tratamiento. Si la información es proporcionada directamente por un menor, este tiene el deber de informar a un adulto responsable. Tanto el representante legal como el propio menor podrán ejercer sus derechos en cualquier momento.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-black text-[#181B1C] uppercase tracking-tight mb-4 pb-2 border-b-2 border-[#85C639]">Tus derechos como titular</h3>
        <ul className="space-y-2">
          {[
            'Acceder a sus datos personales y conocer el tratamiento que se les ha dado.',
            'Solicitar la actualización, corrección o rectificación de su información.',
            'Solicitar información sobre el uso que se ha dado a sus datos.',
            'Revocar la autorización y/o solicitar la supresión de sus datos cuando sea procedente.',
            'Oponerse al tratamiento en los casos permitidos por la normativa.',
            'Abstenerse de suministrar datos sensibles o datos de menores, salvo los autorizados por la ley.',
            'Presentar consultas, quejas o reclamos ante el responsable o la autoridad competente.',
          ].map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="flex-shrink-0 text-[#85C639] font-black">({['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'][i]})</span>
              {r}
            </li>
          ))}
        </ul>
        <div className="mt-4 bg-[#181B1C] rounded-xl p-4">
          <p className="text-white text-sm">Para ejercer tus derechos escríbenos a <span className="text-[#85C639] font-bold">protecciondedatos@incap.com.co</span> o ingresa a <span className="text-[#85C639] font-bold">incap.dataprotected.co</span></p>
        </div>
      </div>
    </div>
  );
}

export default function PoliticaDatosPage() {
  const [activeSection, setActiveSection] = useState('general');

  const sections: Record<string, React.ReactNode> = {
    general: <SectionGeneral />,
    definiciones: <SectionDefiniciones />,
    tratamiento: <SectionTratamiento />,
    derechos: <SectionDerechos />,
    aspectos: <SectionAspectos />,
    avisos: <SectionAvisos />,
  };

  return (
    <div className="min-h-screen bg-white font-sora -mt-[124px]">
      {/* Hero */}
      <div className="bg-[#181B1C] pt-[124px] pb-16 px-4">
        <div className="max-w-[1536px] mx-auto">
          <span className="text-[#85C639] font-black uppercase tracking-[0.5em] text-xs block mb-4">INCAP S A · NIT 860025998-3</span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase leading-none tracking-tighter mb-4">
            Política de<br /><span className="text-[#2A4899]">Tratamiento</span><br />de Datos
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
            Hemos organizado nuestra política en secciones para facilitar su lectura y comprensión. Selecciona la sección que te interesa.
          </p>
          <div className="flex items-center gap-3 mt-6 text-xs text-slate-500">
            <span className="bg-white/10 px-3 py-1 rounded-full">Versión 2</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Vigente desde 28/03/2025</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Ley 1581 de 2012</span>
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden overflow-x-auto border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="flex min-w-max px-4">
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-4 py-3.5 text-xs font-black uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors ${activeSection === s.id ? 'border-[#2A4899] text-[#2A4899]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-3">Secciones</p>
              {NAV_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all text-sm font-semibold ${activeSection === s.id ? 'bg-[#2A4899] text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-[#2A4899]'}`}
                >
                  <span className="text-base">{s.icon}</span>
                  {s.label}
                </button>
              ))}
              <ContactCard />
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">{NAV_SECTIONS.find(s => s.id === activeSection)?.icon}</span>
                <h2 className="text-2xl font-black text-[#181B1C] uppercase tracking-tight">
                  {NAV_SECTIONS.find(s => s.id === activeSection)?.label}
                </h2>
              </div>
              {sections[activeSection]}
            </div>

            {/* Mobile contact card */}
            <div className="lg:hidden mt-6">
              <ContactCard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};
