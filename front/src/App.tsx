import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import HomePage from '@/pages/Home'
import CollectionPage from '@/pages/Collection'

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/collections/:id" element={<CollectionPage/>}/>
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
