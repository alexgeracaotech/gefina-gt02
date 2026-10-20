import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from 'react-router';

import DashboardPage from './DashboardPage.tsx';
import InvoicePage from './InvoicePage.tsx';

export default function App() {
    return <BrowserRouter>
        <nav>
            <Link to='/'>Painiel Inicial</Link>
            <Link to='/faturas'>Faturas</Link>
        </nav>
        <Routes>
            <Route path='/' element={<DashboardPage/>} />
            <Route path='/faturas' element={<InvoicePage/>} />
        </Routes>
    </BrowserRouter>
}