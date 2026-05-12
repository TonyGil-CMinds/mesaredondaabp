"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { animate } from "animejs";

export default function Home() {
  const [step, setStep] = useState(1);
  const [activeDate, setActiveDate] = useState(19);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    organizacion: "",
    rol: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const [localTimes, setLocalTimes] = useState({ 19: "10 AM COL", 20: "10 AM COL", 21: "10 AM COL" });

  useEffect(() => {
    const formatEventTime = (isoString) => {
      const d = new Date(isoString);
      const hourFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: true });
      const timeStr = hourFormatter.format(d);

      const tzFormatter = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' });
      const parts = tzFormatter.formatToParts(d);
      const tzPart = parts.find(p => p.type === 'timeZoneName')?.value || '';

      return `${timeStr} ${tzPart}`.toUpperCase();
    };

    setLocalTimes({
      19: formatEventTime('2026-05-19T10:00:00-05:00'),
      20: formatEventTime('2026-05-20T10:00:00-05:00'),
      21: formatEventTime('2026-05-21T10:00:00-05:00'),
    });
  }, []);

  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const logoRef = useRef(null);
  const btnRef = useRef(null);

  const formTitleRef = useRef(null);
  const formSubtitleRef = useRef(null);
  const formFieldsRef = useRef(null);
  const formActionsRef = useRef(null);

  const successTitleRef = useRef(null);
  const successSubtitleRef = useRef(null);
  const successDateRef = useRef(null);
  const socialIconsRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    // Continuous animations for Step 1/2 assets
    animate('.asset-hand', {
      y: [0, -15],
      rotate: [0, 2],
      alternate: true,
      loop: true,
      ease: 'inOutSine',
      duration: 3000
    });

    animate('.asset-lower', {
      x: [0, -10],
      alternate: true,
      loop: true,
      ease: 'inOutSine',
      duration: 5000
    });
  }, []);

  useEffect(() => {
    if (step === 1) {
      const tl = gsap.timeline();
      tl.fromTo(logoRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
        .fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .fromTo(cardsRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.4")
        .fromTo(btnRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }, "-=0.2");

      // Ensure lower asset and hand are visible
      gsap.to('.asset-lower', { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" });
      gsap.to('.asset-hand', { opacity: 1, duration: 0.8 });
      // Ensure side assets are hidden
      gsap.to('.asset-green', { x: -500, opacity: 0, duration: 0 });
      gsap.to('.asset-red', { x: 500, opacity: 0, duration: 0 });

    } else if (step === 2) {
      const tl = gsap.timeline();
      tl.fromTo(formTitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
        .fromTo(formSubtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .fromTo(formFieldsRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.4")
        .fromTo(formActionsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.2");

    } else if (step === 3) {
      const tl = gsap.timeline();
      tl.fromTo('.asset-green', { x: -500, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" })
        .fromTo('.asset-red', { x: 500, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=1.2")
        .fromTo(successTitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .fromTo(successSubtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .fromTo(successDateRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4")
        .fromTo(socialIconsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.2");
    }
  }, [step]);

  const handleCardClick = (date) => {
    setActiveDate(date);
    gsap.fromTo(cardsRef.current[date - 19], { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" });
  };

  const handleNextStep = () => {
    gsap.to(step1Ref.current, { opacity: 0, y: -20, duration: 0.4, onComplete: () => setStep(2) });
    gsap.to('.asset-lower', { y: 500, opacity: 0, duration: 0.8, ease: "power2.in" });
  };

  const handlePrevStep = () => {
    gsap.to(step2Ref.current, { opacity: 0, y: 20, duration: 0.4, onComplete: () => setStep(1) });
    gsap.to('.asset-lower', { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, activeDate }),
      });
      const data = await response.json();

      if (data.success) {
        if (data.isUpdate) {
          setToast("Tu correo ya ha sido registrado, se actualizarán tus datos.");
          setTimeout(() => setToast(""), 4000);
        }

        setTimeout(() => {
          gsap.to(step2Ref.current, {
            opacity: 0, y: -20, duration: 0.4, onComplete: () => {
              setStep(3);
              setIsSubmitting(false);
            }
          });
          gsap.to('.asset-hand', { opacity: 0, duration: 0.4 });
        }, 1000);
      } else {
        alert("Ocurrió un error al registrarse. Intenta de nuevo.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  const resetToStart = () => {
    const currentStepRef = step === 1 ? step1Ref : step === 2 ? step2Ref : step3Ref;
    if (step !== 1) {
      gsap.to(currentStepRef.current, {
        opacity: 0, duration: 0.3, onComplete: () => {
          setStep(1);
          setFormData({ nombre: "", apellido: "", correo: "", organizacion: "", rol: "" });
          setActiveDate(19);
        }
      });
    }
  };

  const isFormValid = Object.values(formData).every(val => val.trim() !== "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getActiveDateString = () => {
    if (activeDate === 19) return "MARTES 19 DE MAYO";
    if (activeDate === 20) return "MIÉRCOLES 20 DE MAYO";
    return "JUEVES 21 DE MAYO";
  };

  return (
    <main>
      <div className="container">
        <div className="logo-container" ref={logoRef} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={resetToStart}>
          <Image src="/images/logoBPA.svg" alt="Áreas de Bioprosperidad" width={200} height={80} priority />
          {step === 3 && (
            <div className="catalizado-container font-paragraph">
              CATALIZADO POR <Image src="/images/logoCEIBA.svg" alt="CEIBA" width={50} height={20} />
            </div>
          )}
        </div>

        {step === 1 && (
          <div ref={step1Ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <h1 className="title font-title" ref={titleRef}>¿CUÁNDO DESEAS PARTICIPAR?</h1>
            <p className="subtitle font-paragraph" ref={subtitleRef}>Elige entre una de las tres fechas del mes de mayo de tu preferencia</p>

            <div className="cards-container">
              {[
                { day: 19, name: "MA, MAYO" },
                { day: 20, name: "MIE, MAYO" },
                { day: 21, name: "JUE, MAYO" }
              ].map((item, index) => (
                <div
                  key={item.day}
                  ref={el => cardsRef.current[index] = el}
                  className={`date-card ${activeDate === item.day ? 'active' : ''}`}
                  onClick={() => handleCardClick(item.day)}
                >
                  <div className="card-month font-paragraph">{item.name}</div>
                  <div className="card-day font-title">{item.day}</div>
                  <div className="card-time font-paragraph">{localTimes[item.day] || "10 AM COL"}</div>
                </div>
              ))}
            </div>

            <button className="btn-continue font-button" ref={btnRef} onClick={handleNextStep}>CONTINUAR</button>
          </div>
        )}

        {step === 2 && (
          <div ref={step2Ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <h1 className="title font-title" ref={formTitleRef}>INFORMACIÓN DE CONTACTO</h1>
            <p className="subtitle font-paragraph" ref={formSubtitleRef}>Completa todos los campos requeridos a continuación</p>

            <div className="form-container" ref={formFieldsRef}>
              <div className="form-row">
                <div className="form-group">
                  <input type="text" name="nombre" placeholder="NOMBRE" value={formData.nombre} onChange={handleInputChange} className={`form-input ${formData.nombre ? 'filled' : ''}`} />
                </div>
                <div className="form-group">
                  <input type="text" name="apellido" placeholder="APELLIDO" value={formData.apellido} onChange={handleInputChange} className={`form-input ${formData.apellido ? 'filled' : ''}`} />
                </div>
              </div>
              <div className="form-group">
                <input type="email" name="correo" placeholder="TUCORREO@EMAIL.COM" value={formData.correo} onChange={handleInputChange} className={`form-input ${formData.correo ? 'filled' : ''}`} />
              </div>
              <div className="form-group">
                <input type="text" name="organizacion" placeholder="ORGANIZACIÓN" value={formData.organizacion} onChange={handleInputChange} className={`form-input ${formData.organizacion ? 'filled' : ''}`} />
              </div>
              <div className="form-group">
                <input type="text" name="rol" placeholder="ROL" value={formData.rol} onChange={handleInputChange} className={`form-input ${formData.rol ? 'filled' : ''}`} />
              </div>
            </div>

            <div className="actions-container" ref={formActionsRef}>
              <button className="btn-back font-button" onClick={handlePrevStep}>REGRESAR</button>
              <button className={`btn-submit font-button ${isFormValid ? 'active' : ''} ${isSubmitting ? 'loading' : ''}`} disabled={!isFormValid || isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div ref={step3Ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <h1 className="success-title font-title" ref={successTitleRef}>
              GRACIAS POR CONFIRMAR<br />TU ASISTENCIA A NUESTRA<br /><span>MESA REDONDA</span>
            </h1>
            <p className="success-subtitle font-paragraph" ref={successSubtitleRef}>
              En breve recibirás un correo con el enlace de la reunión.
            </p>

            <div className="success-date-card font-button" ref={successDateRef}>
              {getActiveDateString()}
            </div>

            <div className="social-icons" ref={socialIconsRef}>
              <img src="/images/icon-ln.svg" alt="LinkedIn" className="social-icon" />
              <img src="/images/icon-ig.svg" alt="Instagram" className="social-icon" />
              <img src="/images/icon-fb.svg" alt="Facebook" className="social-icon" />
              <img src="/images/icon-wp.svg" alt="WhatsApp" className="social-icon" />
            </div>

            <div className="footer-text font-paragraph" ref={footerRef}>
              © NaturaTech LAC. Todos los derechos reservados 2026
            </div>
          </div>
        )}

      </div>

      <div className="assets-container">
        <img src="/images/lowerAsset.png" alt="" className="asset-lower" />


        {step === 3 && (
          <>
            <img src="/images/greenAsset.png" alt="" className="asset-green" />
            <img src="/images/redAsset.png" alt="" className="asset-red" />
          </>
        )}
      </div>

      {toast && (
        <div className="toast-message font-paragraph">
          {toast}
        </div>
      )}
    </main>
  );
}
