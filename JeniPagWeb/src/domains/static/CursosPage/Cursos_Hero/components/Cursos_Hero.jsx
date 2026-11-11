import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export function HeroCourse() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const currentSection = sectionRef.current
        if (!currentSection) return

        let timer = null

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    timer = setTimeout(() => {
                        setIsVisible(true)
                    }, 80)
                } else {
                    setIsVisible(false)
                }
            },
            {
                threshold: 0.15,
            }
        )

        observer.observe(currentSection)

        return () => {
            if (timer) clearTimeout(timer)
            if (currentSection) observer.unobserve(currentSection)
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            id="Panel_Course"
            className="w-full overflow-hidden relative mx-auto grid max-w-[1240px] items-center gap-8 sm:gap-12 px-5 sm:px-6 lg:px-10 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 lg:grid-cols-[1.02fr_.98fr]"
        >
            <div>
                {/* Elemento 1: Animación sin retraso */}
                <p className={`eyebrow mb-4 sm:mb-7 text-xs sm:text-sm transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Curso online · Aprende a tu ritmo
                </p>

                {/* Elemento 2: Animación con 150ms de retraso */}
                <h1 className={`max-w-[720px] text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] sm:leading-[0.95] tracking-tight transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: '150ms' }}>
                    El conocimiento te <span className="font-serif font-normal italic text-gold">impulsa.</span>
                </h1>

                {/* Elemento 3: Animación con 300ms de retraso */}
                <p className={`mt-5 sm:mt-8 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-text-body transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: '300ms' }}>
                    Desarrolla habilidades para un mundo
                    que no deja de evolucionar.
                </p>

                {/* Elemento 4: Animación con 450ms de retraso */}
                <div className={`mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: '450ms' }}>
                    <Link
                        to="/inscripcion"
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-[#af7e35] text-white font-bold py-3.5 px-8 rounded-xl hover:bg-[#8e6d23] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-center"
                    >
                        Inscribirse ahora
                    </Link>
                </div>
            </div>
            {/* Imagen: Animación con 500ms de retraso y un movimiento desde la derecha */}
            <div className={`relative mx-auto w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[570px] lg:ml-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
                style={{ transitionDelay: '500ms' }}>
                <div className="absolute -left-4 sm:-left-5 top-10 sm:top-14 h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-gold-light lg:-left-12 pointer-events-none" />
                <div className="absolute -right-6 sm:-right-10 lg:-right-16 -top-8 sm:-top-14 h-36 w-36 sm:h-48 sm:w-48 rounded-full border-[20px] sm:border-[34px] border-gold-border pointer-events-none" />
                <figure className="hero-image relative aspect-[4/4] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2rem] shadow-xl">
                    <img
                        className="h-full w-full object-cover"
                        src="/CursoPage_img/Curso_img.jpeg" alt="Imagen para panel de cursos" />
                </figure>
            </div>
        </section>
    )
}

export default HeroCourse