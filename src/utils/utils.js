const isMobile = (breakpoint) => {
    return breakpoint === "sm" || breakpoint === "md" || breakpoint === "lg"
}

const findFieldByName = (fieldList, fieldName) => {
    const field = fieldList.find((item) => {
        return item.name === fieldName
    })

    // if not found return undefindd
    return field
}

const avatarInitials = (fullName) => {
    if (fullName) {
        const names = fullName.split(" ").map((el) => {
            return el[0]
        })
        if (names.length > 2) {
            const res = names[0] + names[(names.length - 1)]
            return res.join("")
        }
        return names.join("")
    }
}

export { isMobile, findFieldByName, avatarInitials }