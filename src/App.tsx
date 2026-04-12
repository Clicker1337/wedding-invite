import Hero from './components/Hero'
import Couple from './components/Couple'
import Countdown from './components/CountDown'
import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
import RSVP from './components/RSVP'
import Footer from './components/Footer'
import GuestList from './components/GuestList'
import MenuSurvey from './components/MenuSurvey'
import './App.css'

type Page = 'home' | 'admin' | 'menu'

function getPage(): Page {
    const search = window.location.search
    if (search.includes('admin')) return 'admin'
    if (search.includes('menu')) return 'menu'
    return 'home'
}

export default function App() {
    const page = getPage()

    if (page === 'admin') {
        return (
            <div className="app">
                <div className="admin-page">
                    <div className="admin-header">
                        <h1 className="section-title">👑 Панель молодожёнов</h1>
                        <a href="/" className="admin-back">← На сайт</a>
                    </div>
                    <GuestList />
                </div>
            </div>
        )
    }

    if (page === 'menu') {
        return (
            <div className="app">
                <MenuSurvey />
            </div>
        )
    }

    return (
        <div className="app">
            <Hero />
            <Couple />
            <Countdown />
            <Timeline />
            <Gallery />
            <RSVP />
            <Footer />
        </div>
    )
}