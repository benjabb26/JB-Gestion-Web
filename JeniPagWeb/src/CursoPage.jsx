import { Header } from './layout/Header'
import { Footer } from './layout/Footer'
import { HeroCourse } from './domains/static/CursosPage/Cursos_Hero/components/Cursos_Hero'

export function CursoPage() {
    return (
        <>
            <Header />
            <HeroCourse />
            <Footer />
        </>
    )
}

export default CursoPage