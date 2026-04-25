import { motion } from "framer-motion";
const press = {
  whileTap: { scale: 0.94 },
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 20,
  },
};
export default function QuickAdd() {
  return (
    <>
      {/* Energy */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div>
          <label className="text-xs text-zinc-400">Energy</label>
          <div className="flex gap-2 mt-1">
            <input className="flex-1 bg-zinc-900 h-11 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600" />
            <div className="bg-zinc-900 px-3 h-11 flex items-center rounded-xl text-sm text-zinc-300">
              kcal
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Macro sum is 0 kcal
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2">
          {["Protein", "Fat", "Carbs"].map((label) => (
            <div key={label}>
              <label className="text-xs text-zinc-400">{label}</label>
              <div className="flex mt-1">
                <input className="flex-1 bg-zinc-900 min-w-0 h-11 px-2 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-zinc-600" />
                <div className="bg-zinc-900 px-2 h-11 flex items-center rounded-r-xl text-xs text-zinc-400">
                  g
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alcohol */}
        <div>
          <label className="text-xs text-zinc-400">Alcohol</label>
          <div className="flex mt-1">
            <input className="flex-1 bg-zinc-900 h-11 px-3 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-zinc-600" />
            <div className="bg-zinc-900 px-2 h-11 flex items-center rounded-r-xl text-xs text-zinc-400">
              g
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs text-zinc-400">Name</label>
          <input className="w-full bg-zinc-900 h-11 px-3 rounded-xl mt-1 focus:outline-none focus:ring-1 focus:ring-zinc-600" />
        </div>

        {/* Buttons */}
        <div className="pt-4 space-y-3">
          <motion.button
            {...press}
            className="w-full h-12 bg-zinc-800 rounded-2xl text-sm font-medium active:bg-zinc-700"
          >
            Quick Add
          </motion.button>

          <motion.button
            {...press}
            className="w-full h-12 bg-white text-black rounded-2xl text-sm font-semibold active:bg-zinc-200"
          >
            Log Foods
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
