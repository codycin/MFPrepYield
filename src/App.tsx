import MacroUI from "./components/MacroUI";
import { EntriesProvider } from "./Context/EntriesContext";

function App() {
  return (
    <div>
      <EntriesProvider>
        <MacroUI />
      </EntriesProvider>
    </div>
  );
}

export default App;
