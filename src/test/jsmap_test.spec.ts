import JsMap from "../lib/JsMap"

describe("jsmap", () => {

  it("merge",   (done:() => void) => {
    const r = JsMap.merge([{ b: "bbb" }, { c: "true" }])

    expect(r["b"]).toBe("bbb")
    expect(r["c"]).toBe("true")

    done()
  })

})