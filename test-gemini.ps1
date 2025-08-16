Write-Host "🤖 Testando API do Gemini..." -ForegroundColor Green

$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Crie uma mensagem de CTA para WhatsApp para um liquidificador. Seja criativo em 3 linhas."
                }
            )
        }
    )
    generationConfig = @{
        temperature = 0.7
        topK = 40
        topP = 0.95
        maxOutputTokens = 1024
    }
} | ConvertTo-Json -Depth 10

$uri = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAeLqHqMwAg4-bim8rmSKQDOXeDha1lyRg"

try {
    Write-Host "📡 Fazendo requisição..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Sucesso! Resposta da IA:" -ForegroundColor Green
    Write-Host "---" -ForegroundColor Cyan
    Write-Host $response.candidates[0].content.parts[0].text -ForegroundColor White
    Write-Host "---" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erro:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}