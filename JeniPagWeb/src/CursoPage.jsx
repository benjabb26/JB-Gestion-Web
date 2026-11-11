import { Header } from './layout/Header'
import { Footer } from './layout/Footer'
import { HeroCourse } from './domains/static/CursosPage/Cursos_Hero/components/Cursos_Hero'
import { CursosDisponiblesSection } from './domains/static/CursosPage/curso_disponibles/components/CursosDisponiblesSection'

export function CursoPage() {
    return (
        <div className="w-full min-h-screen overflow-x-hidden bg-white flex flex-col">
            <Header />
            <main className="flex-1 w-full">
                <HeroCourse />
                <CursosDisponiblesSection />
            </main>
            <Footer />
        </div>
    )
}

export default CursoPage