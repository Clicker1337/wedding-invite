import Hero from './components/Hero'
import Couple from './components/Couple'
import Countdown from './components/CountDown'
import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
import RSVP from './components/RSVP'
import Footer from './components/Footer'
import GuestList from './components/GuestList'
import './App.css'

export default function App() {
    const isAdmin = window.location.search.includes('admin')

    if (isAdmin) {
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