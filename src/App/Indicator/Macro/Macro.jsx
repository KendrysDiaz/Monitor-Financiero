import GraphDesempleoYears from "./Components/GraphDesempleoYears";
import GraphDeudaYears from "./Components/GraphDeudaYears";
import GraphInflaYears from "./Components/GraphInflaYears";
import GraphPIBYears from "./Components/GraphPIBYears";
import './Css/Macro.css'

export default function Macro() {
    return (
        <div className="home_macro">
                <section style={{marginBottom: '16px'}}>
                    <GraphPIBYears/>
                    <GraphInflaYears/>
                </section>
                <section>
                    <GraphDesempleoYears/>
                    <GraphDeudaYears/>
                </section>
        </div>
    );
}
