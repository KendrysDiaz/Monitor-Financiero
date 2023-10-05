import './Home.css'
import Card from './Card'
import BarChart from './Chart'
export default function Home() {
    return <div>
    <section className='home'>
        <Card
        title="PIB"
        description="$4'000.000"
        background='linear-gradient(135deg, #0FF0B3 0%,#036ED9 100%)'
        />
        <Card
        title="Inflación"
        description="$4'000.000"
        background='linear-gradient(135deg, #13f1fc 0%,#0470dc 100%)'
        />
        <Card
        title="Desempleo"
        description="$4'000.000"
        background='linear-gradient(135deg, #f2d50f 0%,#da0641 100%)'
        />
        <Card
        title="Moneda"
        description="$4'000.000"
        background='linear-gradient(135deg, #f02fc2 0%,#6094ea 100%)'
        
        />
    </section>
    
    <BarChart/>
  </div>
}