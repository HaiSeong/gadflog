import {type FC} from "react"
import {CollectionCard} from "@/components/collection/CollectionCard"
import {MasonryGrid} from "@/components/layout/MasonryGrid"

const MOCK_COLLECTIONS = [
    {
        id: "1",
        title: "데이터베이스 설계와 최적화",
        rootDiscussion: {
            id: "1",
            title: "마이크로서비스 아키텍처에서 데이터 일관성을 어떻게 유지할 수 있을까? SAGA 패턴과 분산 트랜잭션의 관점에서"
        },
        leadDiscussions: [
            {id: "1", title: "이벤트 소싱과 CQRS 패턴을 실제 프로젝트에 어떻게 적용할 수 있을까?"},
            {id: "2", title: "대규모 데이터 처리에서 NoSQL과 RDB를 언제, 어떻게 선택해야 할까?"}
        ]
    },
    {
        id: "2",
        title: "시스템 확장성",
        rootDiscussion: {
            id: "2",
            title: "서비스의 급격한 성장에 대비한 확장 전략은?"
        },
        leadDiscussions: [
            {id: "3", title: "수평적 확장 vs 수직적 확장: 언제 어떤 것을 선택해야 할까?"}
        ]
    },
    {
        id: "3",
        title: "백엔드 성능 최적화: 대용량 트래픽 처리를 위한 전략과 실제 구현 방법",
        rootDiscussion: {
            id: "3",
            title: "백엔드 API의 응답 시간을 어떻게 하면 최소화할 수 있을까? 캐싱, 비동기 처리, DB 쿼리 최적화 관점에서"
        },
        leadDiscussions: [
            {id: "4", title: "Redis를 활용한 효과적인 캐시 전략 수립 방법"},
            {id: "5", title: "DB 인덱스 설계와 쿼리 최적화 전략"},
            {id: "6", title: "대용량 데이터 처리를 위한 비동기 작업 큐 설계"}
        ]
    },
    {
        id: "4",
        title: "보안과 인증",
        rootDiscussion: {
            id: "4",
            title: "JWT vs 세션 기반 인증: 언제 어떤 방식을 선택해야 할까?"
        },
        leadDiscussions: [
            {id: "7", title: "OAuth 2.0 구현 시 고려해야 할 보안 사항들"},
            {id: "8", title: "API 보안을 위한 rate limiting 전략"},
            {id: "9", title: "액세스 토큰과 리프레시 토큰의 효과적인 관리 방법"}
        ]
    },
    {
        id: "5",
        title: "테스트와 배포",
        rootDiscussion: {
            id: "5",
            title: "어떻게 하면 효과적인 테스트 자동화 파이프라인을 구축할 수 있을까?"
        },
        leadDiscussions: [
            {id: "10", title: "단위 테스트와 통합 테스트의 적절한 비율은?"},
            {id: "11", title: "TDD를 실제 프로젝트에 도입하는 방법"},
            {id: "12", title: "무중단 배포 전략과 구현 방법"}
        ]
    },
    {
        id: "6",
        title: "클린 아키텍처와 디자인 패턴",
        rootDiscussion: {
            id: "6",
            title: "도메인 주도 설계(DDD)를 실제 프로젝트에 어떻게 적용할 수 있을까?"
        },
        leadDiscussions: [
            {id: "13", title: "헥사고날 아키텍처의 실제 구현 사례와 장단점"},
            {id: "14", title: "의존성 주입과 IoC 컨테이너의 효과적인 활용 방법"},
            {id: "15", title: "클린 아키텍처에서 외부 서비스 연동 처리 방법"},
            {id: "16", title: "이벤트 기반 아키텍처 설계와 구현 전략"},
            {id: "17", title: "마이크로서비스 간 통신 패턴 선택 기준"},
            {id: "18", title: "비즈니스 로직의 계층 분리와 관리 방법"}
        ]
    },
    {
        id: "7",
        title: "로깅과 모니터링 전략",
        rootDiscussion: {
            id: "7",
            title: "대규모 시스템에서 효과적인 로그 수집과 분석 전략은 무엇일까?"
        },
        leadDiscussions: [
            {id: "19", title: "ELK 스택과 Prometheus + Grafana 중 어떤 것을 선택해야 할까?"},
            {id: "20", title: "로그 레벨 설정과 관리의 베스트 프랙티스"},
            {id: "21", title: "분산 추적(Distributed Tracing)을 위한 전략 수립 방법"}
        ]
    },
    {
        id: "8",
        title: "메시지 큐와 이벤트 기반 아키텍처",
        rootDiscussion: {
            id: "8",
            title: "Kafka vs RabbitMQ: 어떤 상황에서 어떤 메시지 큐를 선택해야 할까?"
        },
        leadDiscussions: [
            {id: "22", title: "이벤트 스트리밍 처리의 장애 대응 전략"},
            {id: "23", title: "메시지 큐 파티셔닝 전략과 구현 방법"}
        ]
    },
    {
        id: "9",
        title: "CI/CD와 DevOps",
        rootDiscussion: {
            id: "9",
            title: "GitOps 방식의 배포 파이프라인을 어떻게 구축하고 관리할까?"
        },
        leadDiscussions: [
            {id: "24", title: "Jenkins vs GitHub Actions: 프로젝트 특성에 따른 선택 기준"},
            {id: "25", title: "컨테이너 오케스트레이션 도구 선택과 운영 전략"},
            {id: "26", title: "Infrastructure as Code(IaC)의 효과적인 도입 방법"}
        ]
    },
    {
        id: "10",
        title: "캐시 전략과 성능 최적화",
        rootDiscussion: {
            id: "10",
            title: "다중 캐시 계층(Multi-layer Caching) 설계와 운영 전략은?"
        },
        leadDiscussions: [
            {id: "27", title: "캐시 무효화(Cache Invalidation) 전략과 구현 방법"},
            {id: "28", title: "분산 캐시 시스템에서의 데이터 일관성 유지 방법"},
            {id: "29", title: "CDN 활용과 엣지 컴퓨팅 전략"}
        ]
    },
    {
        id: "11",
        title: "코드 품질과 리팩토링",
        rootDiscussion: {
            id: "11",
            title: "레거시 코드를 어떻게 효과적으로 리팩토링할 수 있을까?"
        },
        leadDiscussions: [
            {id: "30", title: "기술 부채 관리와 점진적 개선 전략"},
            {id: "31", title: "코드 리뷰 문화와 프로세스 개선 방법"}
        ]
    },
    {
        id: "12",
        title: "데이터 파이프라인",
        rootDiscussion: {
            id: "12",
            title: "실시간 데이터 처리 파이프라인 구축 전략은?"
        },
        leadDiscussions: [
            {id: "32", title: "배치 처리 vs 스트림 처리: 상황에 따른 선택 기준"},
            {id: "33", title: "ETL 프로세스 최적화 방법"}
        ]
    },
    {
        id: "13",
        title: "API 설계와 버전 관리",
        rootDiscussion: {
            id: "13",
            title: "RESTful API vs GraphQL: 프로젝트에 따른 선택 기준과 도입 전략은?"
        },
        leadDiscussions: [
            {id: "34", title: "API 버저닝 전략과 하위 호환성 유지 방법"},
            {id: "35", title: "OpenAPI(Swagger) 효과적인 활용 방법"},
            {id: "36", title: "API Gateway 패턴 적용과 관리 전략"}
        ]
    },
    {
        id: "14",
        title: "장애 대응과 복구 전략",
        rootDiscussion: {
            id: "14",
            title: "서비스 장애 시 효과적인 대응과 복구 전략은 무엇일까?"
        },
        leadDiscussions: [
            {id: "37", title: "서킷 브레이커 패턴 구현과 활용 방법"},
            {id: "38", title: "장애 주입 테스트(Chaos Engineering)의 실제 적용 사례"},
            {id: "39", title: "백업과 복구 전략 수립 방법"}
        ]
    },
    {
        id: "15",
        title: "개발 생산성 향상",
        rootDiscussion: {
            id: "15",
            title: "개발 생산성을 높이기 위한 도구와 프로세스 전략은?"
        },
        leadDiscussions: [
            {id: "40", title: "개발 환경 표준화와 도커 활용 전략"},
            {id: "41", title: "코드 제너레이터와 보일러플레이트 관리 방법"},
            {id: "42", title: "효과적인 디버깅 전략과 도구 활용"}
        ]
    },
    {
        id: "16",
        title: "클라우드 네이티브 개발",
        rootDiscussion: {
            id: "16",
            title: "클라우드 네이티브 애플리케이션 개발시 고려해야 할 핵심 요소들은?"
        },
        leadDiscussions: [
            {id: "43", title: "서버리스 아키텍처 도입 시 고려사항과 한계점"},
            {id: "44", title: "멀티 클라우드 전략과 구현 방법"},
            {id: "45", title: "클라우드 비용 최적화 전략"}
        ]
    }
]

const HomePage: FC = () => {
    return (
        <div className="py-6 space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold">Collections</h1>
                <p className="text-muted-foreground">
                    Explore and contribute to question collections
                </p>
            </header>

            <MasonryGrid>
                {MOCK_COLLECTIONS.map(collection => (
                    <div key={collection.id} className="break-inside-avoid mb-4">
                        <CollectionCard
                            title={collection.title}
                            rootDiscussion={collection.rootDiscussion}
                            leadDiscussions={collection.leadDiscussions}
                        />
                    </div>
                ))}
            </MasonryGrid>
        </div>
    )
}

export default HomePage
