import './Navbar.css'
export default function Navbar({option}) {

    return <header className="navbar" style={option == 'Moneda'?{marginBottom:0}:{}}>
    <h4 className="navbar_title">{option}</h4>
    {option == 'Inicio' ? <h4>2023</h4> :<></>}
    </header>
    
}