import './Css/Home.css'
import Card from './Components/Card'
import GraphInflacion2023 from './Components/GraphInflacion2023'
import GraphDesempleo2023 from './Components/GraphDesempleo2023'

export default function Home() {
    return <div className='home'>
    <section className='cards'>
        <Card
        title="PIB / Trimestre II"
        description="240.266,56 Miles de millones COP"
        background='linear-gradient(135deg, #0FF0B3 0%,#036ED9 100%)'
        />
        <Card
        title="Inflación / Septiembre"
        description="10,99%"
        background='linear-gradient(135deg, #13f1fc 0%,#0470dc 100%)'
        />
        <Card
        title="Desempleo / Agosto"
        description="9,3%"
        background='linear-gradient(135deg, #f2d50f 0%,#da0641 100%)'
        />
        <Card
        title="Deuda / Trimestre II"
        description="US$190.429 millones"
        background='linear-gradient(135deg, #f02fc2 0%,#6094ea 100%)'
        
        />
    </section>
    <section style={{display: 'flex'}}>
      <GraphInflacion2023/>
      <GraphDesempleo2023/>
    </section>
    
    
  </div>
}