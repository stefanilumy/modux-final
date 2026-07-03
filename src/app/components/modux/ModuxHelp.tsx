import { HelpCircle, BookOpen, MessageSquare, Lightbulb } from 'lucide-react';

export function ModuxHelp(){
    const faqs = [
        {
            question: "Qual a diferença entre os modos de uso do Modux?",
            answer: "O modo Pesquisa é para respostas rápidas, o modo Programação é formatado para ler e gerar código com clareza, e o Brainstorming te ajuda a explorar ideias criativas."
        },
        {
            question: "Onde ficam salvos os arquivos que eu envio para o Modux?",
            answer: "Todos os documentos que você envia como contexto para a IA ficam armazenados na aba 'Arquivos' na barra lateral, e você pode gerenciá-los por lá."
        }
    ]

    return(
        <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-blue-600" />
                    Central de Ajuda
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                    Tire suas dúvidas e entenda como aproveitar o Modux ao máximo.
                </p>
            </div>

            <div className="space-y-6">
                {faqs.map((faq, index)=> (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow" >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-purple-500 shrink-0 mt-1" />
                            {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed ml-7">{faq.answer}</p>
                    </div>
                ))}
            </div>
            {/* Box extra de suporte */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
                <MessageSquare className="w-10 h-10 text-blue-500 shrink-0" />
                <div>
                <h4 className="text-lg font-medium text-gray-900">Ainda precisa de ajuda?</h4>
                <p className="text-gray-600">Nossa equipe de IHC está sempre coletando feedback. Envie uma mensagem para nós!</p>
                </div>
            </div>
        </div>
    );
}
