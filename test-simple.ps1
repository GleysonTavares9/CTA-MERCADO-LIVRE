$headers = @{'Content-Type' = 'application/json'}
$body = '{"contents":[{"parts":[{"text":"Crie uma mensagem de CTA para WhatsApp para um liquidificador. Seja criativo em 3 linhas."}]}],"generationConfig":{"temperature":0.7,"topK":40,"topP":0.95,"maxOutputTokens":1024}}'
$uri = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAeLqHqMwAg4-bim8rmSKQDOXeDha1lyRg"

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
    Write-Host "Sucesso! Resposta:"
    Write-Host $response.candidates[0].content.parts[0].text
} catch {
    Write-Host "Erro:"
    Write-Host $_.Exception.Message
}