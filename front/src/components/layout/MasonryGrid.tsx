import {type FC, type ReactNode} from "react"

interface MasonryGrid {
    children: ReactNode
}

export const MasonryGrid: FC<MasonryGrid> = ({children}) => {
    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {children}
        </div>
    )
}
