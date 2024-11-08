import {type FC} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {ChevronRight} from "lucide-react"
import {useNavigate} from "react-router-dom"

interface Discussion {
    id: string
    title: string
}

interface CollectionCardProps {
    id: string
    title: string
    rootDiscussion: Discussion
    leadDiscussions: Discussion[]
}

export const CollectionCard: FC<CollectionCardProps> = ({
                                                            id,
                                                            title,
                                                            rootDiscussion,
                                                            leadDiscussions
                                                        }) => {
    const navigate = useNavigate()

    return (
        <Card
            className="h-fit cursor-pointer transition-all hover:shadow-md"
            onClick={() => navigate(`/collections/${id}`)}
        >
            <CardHeader className="p-4">
                <CardTitle className="text-xl whitespace-normal">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
                <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">Root Discussion</div>
                    <Button
                        variant="ghost"
                        className="w-full min-h-[2.5rem] h-auto py-2 justify-start items-start"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/discussions/${rootDiscussion.id}`)
                        }}
                    >
                        <div className="flex w-full">
              <span className="flex-1 text-left whitespace-normal mr-2">
                {rootDiscussion.title}
              </span>
                            <ChevronRight className="h-4 w-4 flex-shrink-0 mt-1"/>
                        </div>
                    </Button>
                </div>

                {leadDiscussions.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="text-sm text-muted-foreground">Lead Discussions</div>
                        <div className="space-y-1">
                            {leadDiscussions.map(discussion => (
                                <Button
                                    key={discussion.id}
                                    variant="ghost"
                                    className="w-full min-h-[2.5rem] h-auto py-2 justify-start items-start"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(`/discussions/${discussion.id}`)
                                    }}
                                >
                                    <div className="flex w-full">
                    <span className="flex-1 text-left whitespace-normal mr-2">
                      {discussion.title}
                    </span>
                                        <ChevronRight className="h-4 w-4 flex-shrink-0 mt-1"/>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
