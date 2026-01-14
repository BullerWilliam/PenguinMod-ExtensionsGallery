class SeededRNG {
  constructor(runtime) {
    this.runtime = runtime
    this.seed = 0n
    this.last = 0

    this.runtime.on("PROJECT_START", () => {
      this.seed = 0n
      this.last = 0
    })
  }

  setSeed(args) {
    try {
      this.seed = BigInt(args.SEED)
    } catch {
      this.seed = 0n
    }
  }

  generate(args) {
    const n = BigInt(args.N)
    const n2 = BigInt(args.N2)

    this.seed ^= this.seed << 13n
    this.seed ^= this.seed >> 7n
    this.seed ^= this.seed << 17n

    const range = (n2 - n) + 1n
    this.last = Number((this.seed % range) + n)
  }

  value() {
    return this.last
  }

  getInfo() {
    return {
      id: "seededrng",
      name: "Seeded RNG",
      blocks: [
        {
          opcode: "setSeed",
          blockType: Scratch.BlockType.COMMAND,
          text: "set seed to [SEED]",
          arguments: {
            SEED: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "12345"
            }
          }
        },
        {
          opcode: "generate",
          blockType: Scratch.BlockType.COMMAND,
          text: "generate random from [N] to [N2]",
          arguments: {
            N: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            },
            N2: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 10
            }
          }
        },
        {
          opcode: "value",
          blockType: Scratch.BlockType.REPORTER,
          text: "random value"
        }
      ]
    }
  }
}

Scratch.extensions.register(new SeededRNG(Scratch.vm.runtime))
