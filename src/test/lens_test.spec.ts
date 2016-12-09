import { Lens } from "../lib/Lens"
import Option from "../lib/Option"

describe("lens", () => {

  interface Person {
    name: string
    address: PostalAddress
  }

  interface PostalAddress {
    road: Road
    city: City
  }

  interface Road {
    name: string
    number: number
  }

  interface City {
    name: string
    country: Country
    zones:Zone[]
  }

  interface Zone {
    name:string
  }

  interface Country {
    name: string
  }

  const pippo: Person = {
    name: "pippo",
    address: {
      road: {
        name: "boschi",
        number: 12
      },
      city: {
        name: "FableTon",
        country: {
          name: "DK"
        },
        zones:[{ name : "zonea" }]
      }
    }
  }

  const lenses = {
    person: {
      name: Lens.create<Person, "name">("name"),
      address: Lens.create<Person, "address">("address")
    },
    address: {
      road: Lens.create<PostalAddress, "road">("road"),
      city: Lens.create<PostalAddress, "city">("city")
    },
    road: Lens.lensed<Road>(pippo.address.road),
    city: {
      name: Lens.create<City, "name">("name"),
      country: Lens.create<City, "country">("country"),
      zones: Lens.create<City, "zones">("zones")
    },
    country: {
      name: Lens.create<Country, "name">("name")
    }
  }

  const nameLens = lenses.person.name

  it("get", (done: () => void) => {
    expect(nameLens.get(pippo)).toBe("pippo")
    done();
  })

  it("set", (done: () => void) => {
    const np = nameLens.set("Pippo")(pippo)
    expect(pippo.name).toBe("pippo")
    expect(np.name).toBe("Pippo")

    done();
  })

  it("update", (done: () => void) => {
    const np = nameLens.update(p => p + " Green")(pippo)
    expect(pippo.name).toBe("pippo")
    expect(np.name).toBe("pippo Green")

    done();
  })

  it("updateOpt", (done: () => void) => {
    const np = nameLens.optUpdate(p => Option.some(p + " Green"))(pippo)
    expect(pippo.name).toBe("pippo")
    expect(np.isDefined()).toBe(true)
    expect(np.getOrElse(() => fail("None")).name).toBe("pippo Green")

    const np1 = nameLens.optUpdate(p => Option.None)(pippo)
    expect(pippo.name).toBe("pippo")
    expect(np1.isEmpty()).toBe(true)

    done();
  })

  const countryNameLens = lenses.person.address.compose(lenses.address.city).compose(lenses.city.country).compose(lenses.country.name)
  const streetNoLens = lenses.person.address.compose(lenses.address.road).compose(lenses.road.number)

  it("compose get", (done: () => void) => {
    expect(countryNameLens.get(pippo)).toBe("DK")

    const n:number = streetNoLens.get(pippo)
    expect(n).toBe(12)
    done();
  })

  it("compose set", (done: () => void) => {
    const np = countryNameLens.set("FK")(pippo)
    expect(pippo.address.city.country.name).toBe("DK")
    expect(np.address.city.country.name).toBe("FK")

    done();
  })

  it("compose update", (done: () => void) => {
    const np = countryNameLens.update(p => p + " Green")(pippo)
    expect(pippo.address.city.country.name).toBe("DK")
    expect(np.address.city.country.name).toBe("DK Green")

    done();
  })

  it("compose updateOpt", (done: () => void) => {
    const np = countryNameLens.optUpdate(p => Option.some(p + " Green"))(pippo)
    expect(pippo.address.city.country.name).toBe("DK")
    expect(np.isDefined()).toBe(true)
    expect(np.getOrElse(() => fail("None")).address.city.country.name).toBe("DK Green")

    const np1 = countryNameLens.optUpdate(p => Option.None)(pippo)
    expect(pippo.address.city.country.name).toBe("DK")
    expect(np1.isEmpty()).toBe(true)

    done();
  })

  it("append", (done: () => void) => {
    const znLens = lenses.person.address.
      compose(lenses.address.city).
      compose(lenses.city.zones).
      compose(Lens.append<Zone>())

    const p1 = znLens.set([{name:"zone b"}])(pippo)

    expect(p1.address.city.zones.length).toBe(2)
    expect(p1.address.city.zones[0].name).toBe("zonea")
    expect(p1.address.city.zones[1].name).toBe("zone b")

    done()
  })
})